import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { AngularAppEngine } from '@angular/ssr';
import * as serverModule from '../dist/product-feedback-app-v2/server/main.server.mjs';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const angularAppEngine = new AngularAppEngine();

let cachedDocument = null;
let cachedManifest = null;

async function getDocument() {
  if (cachedDocument) return cachedDocument;

  try {
    const documentPath = resolve(serverDistFolder, '../browser/index.html');
    console.log('Reading document from:', documentPath);
    cachedDocument = await readFile(documentPath, 'utf-8');
    return cachedDocument;
  } catch (error) {
    console.error('Error reading index.html:', error);
    throw error;
  }
}

async function getManifest() {
  if (cachedManifest) return cachedManifest;

  try {
    const manifestPath = resolve(serverDistFolder, 'server.manifest.json');
    console.log('Reading manifest from:', manifestPath);
    const manifestContent = await readFile(manifestPath, 'utf-8');
    cachedManifest = JSON.parse(manifestContent);
    return cachedManifest;
  } catch (error) {
    console.error('Error reading manifest:', error);
    return null;
  }
}

export const handler = async (event, context) => {
  try {
    console.log('Request received:', {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
    });

    const [document, manifest] = await Promise.all([
      getDocument(),
      getManifest(),
    ]);

    // Set manifest if available
    if (manifest) {
      angularAppEngine.setManifest(manifest);
    }

    // Create request object
    const url = new URL(event.path, 'http://dummy-base.com');
    const request = new Request(url, {
      method: event.httpMethod,
      headers: new Headers(event.headers),
      body: event.body ? event.body : undefined,
    });

    // Handle the request
    const result = await angularAppEngine.handle(request, {
      document,
      documentFilePath: resolve(serverDistFolder, '../browser/index.html'),
      url: event.path,
      bootstrap: serverModule.default,
    });

    if (!result) {
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
    console.log('Current directory:', process.cwd());
    console.log(
      'Directory contents:',
      await readFile(process.cwd(), { withFileTypes: true }),
    );

    try {
      // Attempt fallback to static HTML
      const fallbackHtml = await getDocument();
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
        }),
      };
    }
  }
};
