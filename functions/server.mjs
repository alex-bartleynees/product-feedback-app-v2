import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AngularAppEngine } from '@angular/ssr';

const DIST_PATH = '/var/task/dist/product-feedback-app-v2';
const angularAppEngine = new AngularAppEngine();

let cachedDocument = null;
let cachedManifest = null;

async function getDocument() {
  if (cachedDocument) return cachedDocument;

  try {
    const documentPath = join(DIST_PATH, 'browser/index.html');
    console.log('Reading document from:', documentPath);
    cachedDocument = await readFile(documentPath, 'utf-8');
    return cachedDocument;
  } catch (error) {
    console.error('Error reading index.html:', error);
    console.error('Current directory:', process.cwd());
    // List directory contents for debugging
    const dir = await readFile(process.cwd(), { withFileTypes: true });
    console.log('Directory contents:', dir);
    throw error;
  }
}

async function getManifest() {
  if (cachedManifest) return cachedManifest;

  try {
    const manifestPath = join(DIST_PATH, 'server/server.manifest.json');
    console.log('Reading manifest from:', manifestPath);
    const manifestContent = await readFile(manifestPath, 'utf-8');
    cachedManifest = JSON.parse(manifestContent);
    return cachedManifest;
  } catch (error) {
    console.error('Error reading manifest:', error);
    throw error;
  }
}

export const handler = async (event, context) => {
  try {
    console.log('Request received:', {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
    });

    // Load document and manifest
    const [document, manifest] = await Promise.all([
      getDocument(),
      getManifest(),
    ]);

    console.log('Manifest and document loaded successfully');

    // Set the manifest
    angularAppEngine.setManifest(manifest);

    // Create request object
    const url = new URL(event.path, 'http://localhost');
    const request = new Request(url, {
      method: event.httpMethod,
      headers: new Headers(event.headers),
      body: event.body ? event.body : undefined,
    });

    console.log('Attempting SSR for path:', event.path);

    // Handle the request
    const result = await angularAppEngine.handle(request, {
      document,
      documentFilePath: join(DIST_PATH, 'browser/index.html'),
      url: event.path,
    });

    if (!result) {
      console.log('No SSR result, returning 404');
      return {
        statusCode: 404,
        headers: {
          'content-type': 'text/plain',
        },
        body: 'Not Found',
      };
    }

    // Convert Response stream to text
    let responseText = '';
    for await (const chunk of result) {
      responseText += chunk;
    }

    console.log('SSR successful, response length:', responseText.length);

    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
      body: responseText,
    };
  } catch (error) {
    console.error('Error in handler:', error);
    console.error('Stack:', error.stack);

    try {
      // Attempt fallback to static HTML
      const fallbackHtml = await getDocument();
      console.log('Falling back to static HTML');
      return {
        statusCode: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        },
        body: fallbackHtml,
      };
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      return {
        statusCode: 500,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: error.message,
          details: process.cwd(),
        }),
      };
    }
  }
};
