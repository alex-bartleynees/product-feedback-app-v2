import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  APP_INITIALIZER,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environments/environment';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import {
  hoverPrefetchProviders,
  HoverPreloadStrategy,
} from 'ngx-hover-preload';
import { transferStateInterceptor } from './interceptors/transfer-state.interceptor';
import { csrfInterceptor } from './interceptors/csrf.interceptor';
import { CsrfService } from '../../libs/core-data/src/lib/services/csrf/csrf.service';
import { firstValueFrom } from 'rxjs';

/**
 * Factory function to fetch CSRF token before app starts.
 * This ensures the token is available for all subsequent HTTP requests.
 * Only runs in the browser - skipped during SSR/build.
 */
export function initializeCsrf(csrfService: CsrfService) {
  return () => {
    const platformId = inject(PLATFORM_ID);

    // Only fetch token in the browser, not during SSR
    if (isPlatformBrowser(platformId)) {
      return firstValueFrom(csrfService.fetchCsrfToken());
    }

    // On server, resolve immediately without fetching
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideRouter(appRoutes, withPreloading(HoverPreloadStrategy)),
    hoverPrefetchProviders,
    provideHttpClient(
      withFetch(),
      withInterceptors([transferStateInterceptor, csrfInterceptor]),
    ),
    provideAnimationsAsync(),
    provideZonelessChangeDetection(),
    { provide: APP_CONFIG, useValue: environment },
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCsrf,
      deps: [CsrfService],
      multi: true,
    },
  ],
};
