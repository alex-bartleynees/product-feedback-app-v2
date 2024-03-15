import { app } from '../dist/product-feedback-app-v2/server/server.mjs';

export default async (request, context) => {
  const server = app();
  return new Response(server(request, context));
};
