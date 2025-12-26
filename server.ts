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
import fastifyHttpProxy from '@fastify/http-proxy';
import { AngularAppEngine } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';
import { requestStorage } from './src/app/request-context';

const angularAppEngine = new AngularAppEngine();

export function app() {
  const server = fastify({
    logger: false,
  });

  const angularNodeAppEngine = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // BFF API URL from environment or default to localhost for local development
  const BFF_API_URL = process.env['BFF_API_URL'] || 'http://localhost:5224';

  // Register compression
  server.register(fastifyCompress, {
    global: false,
    encodings: ['gzip', 'deflate'],
    threshold: 1024,
  });

  // Simple proxy configuration (like nginx proxy_set_header)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proxyOptions = (prefix: string): any => ({
    upstream: BFF_API_URL,
    prefix,
    rewritePrefix: prefix,
    http2: false,
    // Forward original host via X-Forwarded-Host (requires ForwardedHeaders middleware in BFF)
    preHandler: (
      req: FastifyRequest,
      reply: FastifyReply,
      done: () => void,
    ) => {
      req.headers['x-forwarded-host'] = req.headers.host;
      done();
    },
  });

  // Proxy routes to BFF
  server.register(fastifyHttpProxy, proxyOptions('/api'));
  server.register(fastifyHttpProxy, proxyOptions('/bff'));
  server.register(fastifyHttpProxy, proxyOptions('/signin-oidc'));
  server.register(fastifyHttpProxy, proxyOptions('/signout-callback-oidc'));

  // Serve static files
  server.register(fastifyStatic, {
    root: browserDistFolder,
    prefix: '/',
    decorateReply: true,
    wildcard: false,
    setHeaders: (res, path) => {
      if (
        path.match(
          /\.[a-f0-9]{8,}\.(js|css|woff2?|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$/i,
        )
      ) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  });

  // Handle all routes with Angular SSR
  server.all('*', async (req: FastifyRequest, reply: FastifyReply) => {
    // Skip routes handled by proxy plugins
    if (
      req.url.startsWith('/api') ||
      req.url.startsWith('/bff') ||
      req.url.startsWith('/signin-oidc') ||
      req.url.startsWith('/signout-callback-oidc')
    ) {
      return;
    }

    try {
      const url = req.url;

      // Try to serve static files first
      if (
        url.match(
          /\.(js|css|ico|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|webp|map|json|txt|xml)$/i,
        )
      ) {
        try {
          return await reply.sendFile(url.split('?')[0].substring(1));
        } catch {
          return reply.callNotFound();
        }
      }

      reply.header(
        'Cache-Control',
        'public, max-age=60, stale-while-revalidate=3600',
      );

      const response = await requestStorage.run(req.raw, async () => {
        return await angularNodeAppEngine.handle(req.raw, {
          server: 'fastify',
        });
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
