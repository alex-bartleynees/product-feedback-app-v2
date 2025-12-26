import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CsrfService } from '@product-feedback-app-v2/core-data';

/**
 * HTTP Interceptor that automatically adds the CSRF token to state-changing requests.
 *
 * The token is added to POST, PUT, DELETE, and PATCH requests that target /api/* and /bff/* endpoints.
 * This protects against Cross-Site Request Forgery (CSRF) attacks.
 */
export const csrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const csrfService = inject(CsrfService);
  const token = csrfService.getToken();

  // Only add CSRF token to state-changing requests to /api/* and /bff/*
  if (token && isStateChangingRequest(req) && isProtectedRoute(req.url)) {
    const cloned = req.clone({
      headers: req.headers.set('X-CSRF-TOKEN', token),
    });
    return next(cloned);
  }

  return next(req);
};

/**
 * Determines if the request is a state-changing operation.
 */
function isStateChangingRequest(req: HttpRequest<unknown>): boolean {
  const method = req.method.toUpperCase();
  return (
    method === 'POST' ||
    method === 'PUT' ||
    method === 'DELETE' ||
    method === 'PATCH'
  );
}

/**
 * Determines if the URL is a protected route that requires CSRF token.
 */
function isProtectedRoute(url: string): boolean {
  return url.startsWith('/api') || url.startsWith('/bff');
}
