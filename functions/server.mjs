import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { AngularNodeAppEngine } from '@angular/ssr/node';
import * as mainServer from '../dist/product-feedback-app-v2/server/main.server.mjs';

const engine = new AngularNodeAppEngine();
let cachedDocument = null;

async function getDocument() {
  if (cachedDocument) return cachedDocument;
  
  try {
    // Use process.cwd() instead of __dirname
    const documentPath = join(process.cwd(), 'dist/product-feedback-app-v2/browser/index.html');
    console.log('Reading document from:', documentPath);
    cachedDocument = await readFile(documentPath, 'utf-8');
    return cachedDocument;
  } catch (error) {
    console.error('Error reading index.html:', error);
    throw error;
  }
}

export const handler = async (event, context) => {
  console.log('Request received:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers
  });

  try {
    const document = await getDocument();
    console.log('Document loaded, length:', document.length);

    const nodeRequest = {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      body: event.body
    };

    console.log('Attempting SSR with URL:', nodeRequest.url);
    const response = await engine.handle(nodeRequest, {
      document,
      documentFilePath: join(process.cwd(), 'dist/product-feedback-app-v2/browser/index.html'),
      url: nodeRequest.url,
      bootstrap: mainServer.default
    });

    if (!response) {
      console.log('No SSR response received');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' }),
        headers: {
          'content-type': 'application/json'
        }
      };
    }

    console.log('Got SSR response, converting stream...');
    let responseText = '';
    for await (const chunk of response) {
      responseText += chunk;
    }
    console.log('Response length:', responseText.length);

    const netlifyResponse = {
      statusCode: 200,
      body: responseText,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
    };

    console.log('Sending response with length:', netlifyResponse.body.length);
    return netlifyResponse;

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
          'cache-control': 'no-store'
        }
      };
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
        headers: {
          'content-type': 'application/json'
        }
      };
    }
  }
};
