const app = require('../../dist/product-feedback-app-v2/server/server.mjs');

export default async (request, context) => {
  console.log('app', app);
  console.log(request);
  console.log(context);
  // fs.readdir('/', (err, files) => {
  //   files.forEach((file) => {
  //     console.log(file);
  //   });
  // });

  // const server = app();
  // return await server(request, context);
};
