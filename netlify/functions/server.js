import { app } from './server/server.mjs';
import fs from 'fs';

export default async (request, context) => {
  console.log('app', app);
  fs.readdir('/', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });

  const server = app();
  return await server(request, context);
};
