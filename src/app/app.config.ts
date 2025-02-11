import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environments/environment';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import {
  hoverPrefetchProviders,
  HoverPreloadStrategy,
} from 'ngx-hover-preload';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideRouter(appRoutes, withPreloading(HoverPreloadStrategy)),
    hoverPrefetchProviders,
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideExperimentalZonelessChangeDetection(),
    { provide: APP_CONFIG, useValue: environment },
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
};
