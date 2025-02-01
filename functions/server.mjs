import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AngularNodeAppEngine } from '@angular/ssr/node';

const engine = new AngularNodeAppEngine();
let cachedDocument = null;

// In Netlify Functions, files are deployed to /var/task/
const DIST_PATH = join('/var/task', 'dist/product-feedback-app-v2');

async function getDocument() {
  if (cachedDocument) return cachedDocument;

  try {
    const documentPath = join(DIST_PATH, 'browser/index.html');
    console.log('Reading document from:', documentPath);
    cachedDocument = await readFile(documentPath, 'utf-8');
    return cachedDocument;
  } catch (error) {
    console.error('Error reading index.html:', error);
    throw error;
  }
}

// Dynamically import the server module
async function getServerModule() {
  try {
    const serverPath = join(DIST_PATH, 'server/main.server.mjs');
    console.log('Loading server module from:', serverPath);
    return await import(serverPath);
  } catch (error) {
    console.error('Error loading server module:', error);
    throw error;
  }
}

export const handler = async (event, context) => {
  console.log('Request received:', {
    method: event.httpMethod,
    path: event.path,
  });

  try {
    // Load the document and server module
    const [document, serverModule] = await Promise.all([
      getDocument(),
      getServerModule(),
    ]);

    console.log('Document and server module loaded');

    const nodeRequest = {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      body: event.body,
    };

    console.log('Attempting SSR with URL:', nodeRequest.url);

    const response = await engine.handle(nodeRequest, {
      document,
      documentFilePath: join(DIST_PATH, 'browser/index.html'),
      url: nodeRequest.url,
      bootstrap: serverModule.default,
    });

    if (!response) {
      console.log('No SSR response received');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' }),
        headers: {
          'content-type': 'application/json',
        },
      };
    }

    console.log('Got SSR response, converting stream...');
    let responseText = '';
    for await (const chunk of response) {
      responseText += chunk;
    }

    console.log('Response length:', responseText.length);

    return {
      statusCode: 200,
      body: responseText,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    };
  } catch (error) {
    console.error('Error in handler:', error);

    try {
      // Attempt fallback to static HTML
      const fallbackHtml = await getDocument();
      return {
        statusCode: 200,
        body: fallbackHtml,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        },
      };
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
        headers: {
          'content-type': 'application/json',
        },
      };
    }
  }
};
