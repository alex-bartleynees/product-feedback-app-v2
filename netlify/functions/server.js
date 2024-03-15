import fs from 'fs';

export default async (request, context) => {
  const app = await import('./server/server.mjs').then((m) => m.app);
  console.log('app', app);
  fs.readdir('/', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });

  const server = app();
  return await server(request, context);
};
