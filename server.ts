import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import fastifyStatic from '@fastify/static';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyCompress from '@fastify/compress';
import { AngularAppEngine } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';

const angularAppEngine = new AngularAppEngine();

export function app() {
  const server = fastify({
    logger: false, // Disable logging in production for performance
  });

  const angularNodeAppEngine = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Register compression plugin with optimized settings for SSR
  server.register(fastifyCompress, {
    global: false, // Don't compress all responses automatically
    encodings: ['gzip', 'deflate'],
    threshold: 1024,
  });

  // Serve static files - use decorator to add sendFile method
  server.register(fastifyStatic, {
    root: browserDistFolder,
    prefix: '/',
    decorateReply: true, // Enable reply.sendFile() decorator
    wildcard: false, // Don't create wildcard routes to avoid conflicts
    setHeaders: (res, path) => {
      // Aggressive caching for hashed assets (JS, CSS, etc.)
      if (path.match(/\.[a-f0-9]{8,}\.(js|css|woff2?|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // Short cache for other static files
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  });

  // Handle all routes with Angular SSR
  server.all('*', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const url = req.url;

      // Try to serve static files first
      if (url.match(/\.(js|css|ico|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|webp|map|json|txt|xml)$/i)) {
        try {
          // Use sendFile to serve static assets
          return await reply.sendFile(url.split('?')[0].substring(1)); // Remove leading slash and query params
        } catch (err) {
          // File not found, fall through to SSR or 404
          return reply.callNotFound();
        }
      }

      // Set cache headers for HTML responses
      reply.header(
        'Cache-Control',
        'public, max-age=60, stale-while-revalidate=3600',
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
      console.error('SSR Error:', error);
      reply.code(500).send('Internal Server Error');
    }
  });

  // Custom 404 handler
  server.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) => {
    reply.code(404).send('Not Found');
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
