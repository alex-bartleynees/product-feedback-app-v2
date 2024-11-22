export const environment = {
  production: true,
  apiEndpoint:
    typeof window === 'undefined'
      ? 'http://product-feedback-api-svc:5185/api/'
      : '/product-feedback-api/api/',
  basePath: '/product-feedback-app',
};
