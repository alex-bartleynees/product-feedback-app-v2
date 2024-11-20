export const environment = {
  production: true,
  apiEndpoint:
    typeof window === 'undefined'
      ? 'http://product-feedback-api-svc:8080/api/'
      : 'https://alexbartleynees.com/product-feedback-app/api/',
  basePath: '/product-feedback-app',
};
