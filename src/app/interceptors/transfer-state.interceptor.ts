import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Normalize URL to a consistent format for caching.
 * Converts both `/api/suggestions` and `http://nginx/api/suggestions`
 * to the same key format so server and client can share cached data.
 */
function normalizeUrl(url: string): string {
  // Remove the nginx host part if present
  return url.replace(/^http:\/\/nginx/, '');
}

/**
 * HTTP Interceptor that uses Angular's TransferState to:
 * - On server: Cache HTTP responses in TransferState
 * - On client: Reuse cached responses from server to avoid duplicate requests
 *
 * This prevents duplicate HTTP calls during hydration when the client
 * takes over from the server-rendered page.
 */
export const transferStateInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);

  // Only handle GET requests for API endpoints
  if (req.method !== 'GET' || !req.url.includes('/api/')) {
    return next(req);
  }

  // Create a normalized cache key
  const normalizedUrl = normalizeUrl(req.url);
  const storeKey = makeStateKey<any>(`http-cache-${normalizedUrl}`);

  // CLIENT: Check if we have cached data from server
  if (isPlatformBrowser(platformId)) {
    const cachedResponse = transferState.get(storeKey, null);

    if (cachedResponse) {
      // Remove from transfer state to free memory
      transferState.remove(storeKey);
      // Return cached response
      return of(new HttpResponse({ body: cachedResponse, status: 200 }));
    }
  }

  // SERVER: Cache the response in TransferState
  if (isPlatformServer(platformId)) {
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          transferState.set(storeKey, event.body);
        }
      })
    );
  }

  // Default: Just pass through
  return next(req);
};
