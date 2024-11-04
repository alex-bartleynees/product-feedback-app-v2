export const environment = {
  production: true,
  apiEndpoint:
    typeof window === 'undefined'
      ? 'http://svc-product-feedback-api:8080/api/'
      : 'https://alex-bartleynees.me/product-feedback-app/api/',
  basePath: '/product-feedback-app',
};
