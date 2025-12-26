import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { getCurrentRequest } from '../request-context';

/**
 * HTTP Interceptor for server-side rendering that:
 * 1. Rewrites API URLs to use the nginx service URL
 * 2. Forwards cookies from the incoming SSR request to outgoing API requests
 *
 * This ensures that authenticated requests work during SSR by:
 * - Routing requests through nginx (which then proxies to the BFF)
 * - Passing the user's session cookies to the BFF API
 */
export const ssrCookieForwardingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const platformId = inject(PLATFORM_ID);

  // Only run this interceptor on the server
  if (!isPlatformServer(platformId)) {
    return next(req);
  }

  try {
    const appConfig = inject(APP_CONFIG);
    let modifiedReq = req;

    // Rewrite relative API URLs to use the nginx service URL
    if (req.url.startsWith('/api/')) {
      const newUrl = req.url.replace('/api/', appConfig.apiEndpointServer);
      modifiedReq = req.clone({
        url: newUrl,
      });
    }

    // Get the incoming request from AsyncLocalStorage
    const incomingRequest = getCurrentRequest();

    if (incomingRequest?.headers.cookie) {
      modifiedReq = modifiedReq.clone({
        setHeaders: {
          Cookie: incomingRequest.headers.cookie,
        },
        withCredentials: true,
      });
    }

    return next(modifiedReq);
  } catch {
    // If anything fails, continue with the original request
    return next(req);
  }
};
