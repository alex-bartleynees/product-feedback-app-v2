import { readFile } from 'node:fs/promises';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';
const htmlFile = await readFile(
  'dist/product-feedback-app-v2/server/index.server.html',
  'utf-8'
);

export default async (request, context) => {
  const url = request.url;
  console.log(htmlFile);
  // const document = Buffer.from(
  //   `${JSON.stringify(
  //     Buffer.from(htmlFile, 'utf-8').toString('base64')
  //   )}, 'base64')`.toString('utf-8')
  // );

  const html = await renderApplication(bootstrap, {
    url: '/',
    document: htmlFile,
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
