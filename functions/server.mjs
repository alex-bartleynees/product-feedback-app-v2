import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cachedDocument = null;

async function getDocument() {
  if (cachedDocument) {
    return cachedDocument;
  }

  try {
    const documentPath = join(
      __dirname,
      '../dist/product-feedback-app-v2/server/index.server.html',
    );
    cachedDocument = await readFile(documentPath, 'utf-8');
    return cachedDocument;
  } catch (error) {
    console.error('Error reading index.server.html:', error);
    throw new Error('Failed to read server document');
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
    const document = await getDocument();

    const renderOptions = {
      url: request.url,
      document,
      platformProviders: [],
      ...((request.headers.get('User-Agent') || '').includes('Googlebot') && {
        renderPriority: 'high',
      }),
    };

    const html = await renderApplication(bootstrap, renderOptions);

    return new Response(html, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('SSR Error:', error);

    try {
      const fallbackDocument = await readFile(
        join(__dirname, '../dist/product-feedback-app-v2/browser/index.html'),
        'utf-8',
      );

      return new Response(fallbackDocument, {
        status: 200,
        headers: {
          ...headers,
          'Cache-Control': 'no-store',
        },
      });
    } catch (fallbackError) {
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

