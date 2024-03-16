import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { readdirSync } from 'node:fs';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';
import { CommonEngine } from '@angular/ssr';

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
const browserDistFolder = join('dist/product-feedback-app-v2/', 'browser');
const documentFilePath = join(
  'dist/product-feedback-app-v2/',
  'server',
  'index.server.html'
);

export default async (request, context) => {
  const url = request.url;
  const fileType = getFileType(url);
  console.log('fileType', fileType);
  const staticFileTypes = ['html', 'css', 'js', 'png', 'jpg', 'svg'];
  console.log(
    'file type included in static file types',
    staticFileTypes.includes(fileType)
  );
  if (fileType && staticFileTypes.includes(fileType)) {
    return new Response(await getFile(url), {
      status: 200,
      headers: {
        'Content-Type': getFileType(url),
      },
    });
  }

  let headers = {
    'Content-Type': 'text/html', // Default content type
    // 'Cache-Control': 'public, max-age=3600', // Example cache control
  };

  if (fileType === 'html') {
    headers['Content-Type'] = 'text/html';
  } else if (fileType === 'css') {
    headers['Content-Type'] = 'text/css';
  } else if (fileType === 'js') {
    headers['Content-Type'] = 'application/javascript';
  }

  const commonEngine = new CommonEngine();

  const html = await commonEngine.render({
    bootstrap: bootstrap,
    url: request.url,
    documentFilePath: documentFilePath,
    publicPath: browserDistFolder,
  });
  return new Response(html, {
    status: 200,
    headers,
  });
};

function getFileType(url) {
  console.log('url', url);
  const parts = url.split('.');
  return parts[parts.length - 1];
}

async function getFile(url) {
  const filePath = splitUrlToGetFile(url);
  const file = join('dist/product-feedback-app-v2/', 'browser', filePath);
  console.log('file', file);
  return await readFile(file, 'utf-8');
}

function splitUrlToGetFile(url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}
