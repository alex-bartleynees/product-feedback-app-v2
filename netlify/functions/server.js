import fs from 'fs';
import { app } from '../../dist/product-feedback-app-v2/server/server.mjs';

export default async (request, context) => {
  console.log('app', app);
  // fs.readdir('/', (err, files) => {
  //   files.forEach((file) => {
  //     console.log(file);
  //   });
  // });

  // const server = app();
  // return await server(request, context);
};
