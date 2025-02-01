import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AngularNodeAppEngine } from '@angular/ssr/node';
import * as mainServer from '../dist/product-feedback-app-v2/server/main.server.mjs';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize the Angular engine once
const engine = new AngularNodeAppEngine();

// Cache the document content
let cachedDocument = null;

async function getDocument() {
  if (cachedDocument) {
    return cachedDocument;
  }

  try {
    const documentPath = join(
      __dirname,
      '../dist/product-feedback-app-v2/browser/index.html',
    );
    cachedDocument = await readFile(documentPath, 'utf-8');
    return cachedDocument;
  } catch (error) {
    console.error('Error reading index.html:', error);
    throw new Error('Failed to read browser document');
  }
}

export default async (request, context) => {
  const headers = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
  };

  try {
    // Convert Netlify request to Node-like request
    const nodeRequest = {
      method: request.method,
      url: new URL(request.url).pathname,
      headers: request.headers,
      body: request.body,
    };

    // Get the document for hydration
    const document = await getDocument();

    // Render the application using the default export
    const response = await engine.handle(nodeRequest, {
      document,
      documentFilePath: join(
        __dirname,
        '../dist/product-feedback-app-v2/browser/index.html',
      ),
      url: nodeRequest.url,
      bootstrap: mainServer.default,
    });

    if (!response) {
      return {
        statusCode: 404,
        headers: {
          'content-type': 'text/plain',
          'cache-control': 'no-store',
        },
        body: 'Not Found',
      };
    }

    // Convert the response stream to string
    const chunks = [];
    for await (const chunk of response) {
      chunks.push(Buffer.from(chunk));
    }
    const html = Buffer.concat(chunks).toString('utf-8');

    return {
      statusCode: 200,
      headers,
      body: html,
    };
  } catch (error) {
    console.error('SSR Error:', error);

    // Attempt to return a fallback client-side only version
    try {
      const fallbackDocument = await getDocument();
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'cache-control': 'no-store',
        },
        body: fallbackDocument,
      };
    } catch (fallbackError) {
      console.error('Fallback Error:', fallbackError);
      return {
        statusCode: 500,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        },
        body: '<!DOCTYPE html><html><body><h1>Something went wrong</h1><p>Please try again later.</p></body></html>',
      };
    }
  }
};
