const { app } = require('./server.mjs');
const fs = require('fs');

exports.handler = (event, context, callback) => {
  console.log('app', app);
  fs.readdir('/', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
  const server = app();

  server(event, context, callback);
};
