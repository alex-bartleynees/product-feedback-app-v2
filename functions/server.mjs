import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';

export default async (request, context) => {
  const indexHtml = '../dist/product-feedback-app-v2/browser/index.server.html';
  const url = request.url;
  const document = Buffer.from(
    `${JSON.stringify(
      Buffer.from(html, 'utf-8').toString('base64')
    )}, 'base64')`.toString('utf-8')
  );

  const html = await renderApplication(bootstrap, {
    url,
    document,
    platformProviders: [
      { provide: 'netlify.request', useValue: request },
      { provide: 'netlify.context', useValue: context },
    ],
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
