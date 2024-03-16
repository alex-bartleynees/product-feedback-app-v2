import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import bootstrap from '../dist/product-feedback-app-v2/server/main.server.mjs';
import { renderApplication } from '../dist/product-feedback-app-v2/server/render-utils.server.mjs';

const getAllFilesIn = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    if (dirent.isDirectory()) {
      return getAllFilesIn(join(dir, dirent.name));
    }
    return [join(dir, dirent.name)];
  });

const htmlFile = await readFile(
  'dist/product-feedback-app-v2/server/index.server.html',
  'utf-8'
);
const staticFiles = getAllFilesIn(
  join('dist/product-feedback-app-v2/', 'browser')
).map(
  (path) =>
    `/${relative(join('dist/product-feedback-app-v2/', 'browser'), path)}`
);
const excludedPaths = [...staticFiles];

export default async (request, context) => {
  const url = request.url;
  console.log(htmlFile);
  // const document = Buffer.from(
  //   `${JSON.stringify(
  //     Buffer.from(htmlFile, 'utf-8').toString('base64')
  //   )}, 'base64')`.toString('utf-8')
  // );
  console.log(excludedPaths);
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
