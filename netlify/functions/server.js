const { app } = require('./server');

exports.handler = (event, context, callback) => {
  const server = app();

  server(event, context, callback);
};
