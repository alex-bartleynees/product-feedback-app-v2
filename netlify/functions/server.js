import fs from 'fs';

export default async (request, context) => {
  const app = require('../../dist/product-feedback-app-v2/server/main').app;
  console.log('app', app);
  fs.readdir('/', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });

  const server = app();
  return await server(request, context);
};
