const app = require('netlify/dist/product-feedback-app-v2/server/server.mjs');

export default async (request, context) => {
  console.log(request);
  console.log(context);
  console.log('app', app);
  const server = app();
  console.log(server);
  // return await server(request, context);
};
