import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import fastifyStatic from '@fastify/static';
import fastifyCaching from '@fastify/caching';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function app() {
  const server = fastify();

  const angularNodeAppEngine = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Register caching plugin
  server.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 3600,
    cache: new Map(),
  });

  // Serve static files with caching
  server.register(fastifyStatic, {
    root: browserDistFolder,
    prefix: '/product-feedback-app',
    decorateReply: false,
    cacheControl: true,
    maxAge: 31536000,
    immutable: true,
    etag: true,
    wildcard: false,
  });

  // Handle all routes with Angular SSR
  server.all('*', async (req: FastifyRequest, reply: FastifyReply) => {
    console.log(req.url);
    try {
      // Add cache headers for dynamic routes
      reply.header('Cache-Control', 'public, max-age=3600');

      // Generate ETag based on URL
      const etag = `"${Buffer.from(`${req.headers.host}${req.url}`).toString('base64')}"`;
      reply.header('ETag', etag);

      // Check if client has matching ETag
      if (req.headers['if-none-match'] === etag) {
        reply.code(304).send('');
        return;
      }

      const response = await angularNodeAppEngine.handle(req.raw, {
        server: 'fastify',
      });

      if (response) {
        await writeResponseToNodeResponse(response, reply.raw);
      } else {
        reply.callNotFound();
      }
    } catch (error) {
      reply.send(error);
    }
  });

  // Custom 404 handler
  server.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) => {
    console.log(req.url);
    reply.code(404).send('This is a server only error');
  });

  return server;
}

const server = app();

if (isMainModule(import.meta.url)) {
  const port = +(process.env['PORT'] || 4000);
  const host = process.env['HOST'] || '0.0.0.0';
  server.listen({ port, host }, () => {
    console.warn(`Fastify server listening on http://${host}:${port}`);
  });
}

console.warn('Fastify server started');

export const reqHandler = createNodeRequestHandler(async (req, res) => {
  await server.ready();
  server.server.emit('request', req, res);
});
