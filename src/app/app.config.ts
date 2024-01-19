import {
  ApplicationConfig,
  ɵprovideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimationsAsync(),
    ɵprovideZonelessChangeDetection(),
    { provide: APP_CONFIG, useValue: environment },
  ],
};
