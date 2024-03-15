import { commonEngine } from '../dist/product-feedback-app-v2/server/server.mjs';
import { bootstrap } from '../dist/product-feedback-app-v2/server/main.server.mjs';

export default async (request, context) => {
  const indexHtml = '../dist/product-feedback-app-v2/browser/index.server.html';
  const baseUrl = '/';
  const html = await commonEngine.render({
    bootstrap,
    documentFilePath: indexHtml,
    url: request.url,
    publicPath: '../dist/product-feedback-app-v2/browser',
    providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
