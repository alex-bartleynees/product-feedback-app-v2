const { app } = require('./server/server');

exports.handler = (event, context, callback) => {
  console.log('app', app);
  const server = app();

  server(event, context, callback);
};
