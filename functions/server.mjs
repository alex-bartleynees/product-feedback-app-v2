import { readFile } from 'node:fs/promises';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';

const document = await readFile(
  'dist/product-feedback-app-v2/server/index.server.html',
  'utf-8'
);

export default async (request, _context) => {
  let headers = {
    'Content-Type': 'text/html',
    'Cache-Control': 'public, max-age=3600',
  };

  const html = await renderApplication(bootstrap, {
    url: request.url,
    document,
    platformProviders: [],
  });
  return new Response(html, {
    status: 200,
    headers,
  });
};
