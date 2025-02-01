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
import fastifyCompress from '@fastify/compress';
import { constants } from 'zlib';
import { AngularAppEngine } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';

const angularAppEngine = new AngularAppEngine();

export function app() {
  const server = fastify();

  const angularNodeAppEngine = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Register compression plugin first
  server.register(fastifyCompress, {
    encodings: ['gzip', 'deflate', 'br'],
    threshold: 1024, // Only compress responses above 1KB
    brotliOptions: {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 4,
      },
    },
    customTypes: /^text\/|^application\/|^image\/svg\+xml/, // Add SVG compression
  });

  // Register caching plugin
  server.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 3600,
    cache: new Map(),
  });

  // Serve static files with caching
  server.register(fastifyStatic, {
    root: browserDistFolder,
    prefix: '/',
    decorateReply: false,
    cacheControl: true,
    maxAge: 31536000,
    immutable: true,
    etag: false,
    wildcard: false,
  });

  // Handle all routes with Angular SSR
  server.all('*', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Add cache headers for dynamic routes
      reply.header(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400',
      );

      const response = await angularNodeAppEngine.handle(req.raw, {
        server: 'fastify',
      });

      if (response) {
        reply.type('text/html');
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
    reply.code(404).send('This is a server only error');
  });

  return server;
}

const server = app();

if (isMainModule(import.meta.url)) {
  const port = +(process.env['PORT'] || 4000);
  const host = process.env['HOST'] || '0.0.0.0';
  try {
    await server.listen({ port, host });
    console.warn(`Fastify server listening on http://${host}:${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

console.warn('Fastify server started');

export async function netlifyAppEngineHandler(
  request: Request,
): Promise<Response> {
  const context = getContext();

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

export const reqHandler = createNodeRequestHandler(async (req, res) => {
  await server.ready();
  server.server.emit('request', req, res);
});
