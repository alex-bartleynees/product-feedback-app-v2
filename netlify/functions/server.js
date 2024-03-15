import fs from 'fs';
import { posix, sep, relative } from 'path';

const toPosix = (path) => path.split(sep).join(posix.sep);

export default async (request, context) => {
  const { app } = require(`${toPosix(
    relative(process.cwd(), __dirname)
  )}/server/server.mjs`);
  console.log('app', app);
  fs.readdir('/', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });

  const server = app();
  return await server(request, context);
};
