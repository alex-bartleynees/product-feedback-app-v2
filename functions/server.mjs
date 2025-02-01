import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getContext } from '@netlify/angular-runtime/context';
import { AngularAppEngine } from '@angular/ssr';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const angularAppEngine = new AngularAppEngine();

async function netlifyAppEngineHandler(request) {
  const context = getContext();
  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

export const handler = async (event, context) => {
  try {
    console.log('Request received:', {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
    });

    // Convert Netlify event to Request
    const url = new URL(event.rawUrl);
    const request = new Request(url, {
      method: event.httpMethod,
      headers: new Headers(event.headers),
      body: event.body ? event.body : undefined,
    });

    // Handle the request
    const response = await netlifyAppEngineHandler(request);

    // Convert Response to Netlify format
    const responseBody = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());

    return {
      statusCode: response.status,
      headers: {
        ...responseHeaders,
        'content-type':
          response.headers.get('content-type') || 'text/html; charset=utf-8',
        'cache-control':
          response.headers.get('cache-control') || 'public, max-age=3600',
      },
      body: responseBody,
    };
  } catch (error) {
    console.error('Error in handler:', error);

    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};

// For local development
if (process.env.NODE_ENV === 'development') {
  import('express').then(({ default: express }) => {
    const app = express();

    // Serve static files
    app.use(
      express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
        redirect: false,
      }),
    );

    // Handle all routes with SSR
    app.all('*', async (req, res) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const request = new Request(url, {
          method: req.method,
          headers: new Headers(req.headers),
          body: req.body,
        });

        const response = await netlifyAppEngineHandler(request);

        // Set status and headers
        res.status(response.status);
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });

        // Send response
        const body = await response.text();
        res.send(body);
      } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Development server listening on http://localhost:${port}`);
    });
  });
}
