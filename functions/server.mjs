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
    'Content-Type': 'text/html',
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };

  try {
    // Convert Netlify request to Node-like request
    const nodeRequest = {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers),
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
      url: request.url,
      bootstrap: mainServer.default, // Using the default export from main.server.mjs
    });

    if (response) {
      // Convert the response stream to string
      const chunks = [];
      for await (const chunk of response) {
        chunks.push(Buffer.from(chunk));
      }
      const html = Buffer.concat(chunks).toString('utf-8');

      return new Response(html, {
        status: 200,
        headers,
      });
    }

    // If no response, return 404
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('SSR Error:', error);

    // Attempt to return a fallback client-side only version
    try {
      const fallbackDocument = await getDocument();
      return new Response(fallbackDocument, {
        status: 200,
        headers: {
          ...headers,
          'Cache-Control': 'no-store',
        },
      });
    } catch (fallbackError) {
      // If all else fails, return an error page
      return new Response(
        '<!DOCTYPE html><html><body><h1>Something went wrong</h1><p>Please try again later.</p></body></html>',
        {
          status: 500,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store',
          },
        },
      );
    }
  }
};
