import { posix, relative, sep } from 'path';
import { app } from `${toPosix(relative(process.cwd(), __dirname))}/server/server.mjs`;
import fs from 'fs';

const toPosix = (path) => path.split(sep).join(posix.sep)

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
