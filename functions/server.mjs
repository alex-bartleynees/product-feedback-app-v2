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
  const url = request.url;
  const fileType = getFileType(url);
  if (excludedPaths.includes(url)) {
    return new Response('Not Found', {
      status: 404,
    });
  }
  let headers = {
    'Content-Type': 'text/plain', // Default content type
    'Cache-Control': 'public, max-age=3600', // Example cache control
  };
  console.log(fileType);
  if (fileType === 'html') {
    headers['Content-Type'] = 'text/html';
  } else if (fileType === 'css') {
    headers['Content-Type'] = 'text/css';
  } else if (fileType === 'js') {
    headers['Content-Type'] = 'application/javascript';
  }

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

function getFileType(url) {
  console.log(url);
  const parts = url.split('.');
  return parts[parts.length - 1];
}
