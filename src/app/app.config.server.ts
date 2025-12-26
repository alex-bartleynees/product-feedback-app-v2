import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { ssrCookieForwardingInterceptor } from './interceptors/ssr-cookie-forwarding.interceptor';
import { transferStateInterceptor } from './interceptors/transfer-state.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideHttpClient(
      withFetch(),
      withInterceptors([transferStateInterceptor, ssrCookieForwardingInterceptor])
    ),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
