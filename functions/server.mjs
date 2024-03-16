import { join, dirname, resolve } from 'node:path';
import express from 'express';
import { fileURLToPath } from 'node:url';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { CommonEngine } from '@angular/ssr';
import { APP_BASE_HREF } from '@angular/common';

export default async (request, context) => {
  const server = express();
  const serverDistFolder = dirname(
    fileURLToPath('dist/product-feedback-app-v2/server/')
  );
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });
};
