import { app } from '../dist/product-feedback-app-v2/server/server.mjs';

export default async (request, context) => {
  const server = app();
  return await server(request, context);
};
