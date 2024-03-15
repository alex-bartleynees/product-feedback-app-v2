const fs = require('fs');

export default async (request, context) => {
  console.log(request);
  console.log(context);

  console.log('reading root directory');
  fs.readdir('../../', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
  console.log('done reading root directory');

  // const server = app();
  // return await server(request, context);
};
