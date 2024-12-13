import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = fastify();

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.register(fastifyStatic, { root: browserDistFolder, wildcard: false });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  // server.get(
  //   '*.*',
  //   express.static(browserDistFolder, {
  //     maxAge: '1y',
  //   }),
  // );

  // All regular routes use the Angular engine
  server.get('*', async (request, reply) => {
    const protocol = request.protocol;
    const originalUrl = request.url;
    const baseUrl = request.url;
    const { host } = request.headers;

    try {
      const html = await commonEngine.render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      });

      reply.type('text/html');
      return html;
    } catch (err) {
      throw err;
    }
  });

  return server;
}

async function run(): Promise<void> {
  const port = process.env['PORT'] || 4000;
  const host = '0.0.0.0'; // Listen on all available network interfaces

  // Start up the Fastify server
  const server = app();

  try {
    await server.listen({ port: Number(port), host });
    console.log(`Fastify server listening on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

run();
