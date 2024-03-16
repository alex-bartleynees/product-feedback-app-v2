import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { readdirSync } from 'node:fs';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';

const getAllFilesIn = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    if (dirent.isDirectory()) {
      return getAllFilesIn(join(dir, dirent.name));
    }
    return [join(dir, dirent.name)];
  });

const document = await readFile(
  'dist/product-feedback-app-v2/server/index.server.html',
  'utf-8'
);
const staticFiles = getAllFilesIn(
  join('dist/product-feedback-app-v2/', 'browser')
).map(
  (path) =>
    `/${relative(join('dist/product-feedback-app-v2/', 'browser'), path)}`
);
const excludedPaths = [...staticFiles];

export default async (request, context) => {
  console.log('request url', request.url);
  const url = request.url;
  if (excludedPaths.includes(url)) {
    return new Response('Not Found', {
      status: 404,
    });
  }
  const html = await renderApplication(bootstrap, {
    url: request.url,
    document,
    platformProviders: [
      { provide: 'netlify.request', useValue: request },
      { provide: 'netlify.context', useValue: context },
    ],
  });
  console.log('html', html);
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
