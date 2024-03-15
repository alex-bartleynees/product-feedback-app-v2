const fs = require('fs');

export default async (request, context) => {
  console.log(request);
  console.log(context);
  console.log('reading files');
  fs.readdir('/', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
  console.log('done reading files');

  console.log('reading root directory');
  fs.readdir('../../dist/product-feedback-app-v2/server', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
  console.log('done reading root directory');

  // const server = app();
  // return await server(request, context);
};
