import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { UsersFacade } from '@product-feedback-app-v2/core-state';
import { filter, map, take } from 'rxjs';

/**
 * Auth guard to protect routes that require authentication.
 * Waits for auth loading to complete before checking authentication.
 * Redirects to home page if user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const usersFacade = inject(UsersFacade);
  const router = inject(Router);

  // Wait for loading to complete, then check authentication
  return toObservable(usersFacade.loading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      if (usersFacade.isAuthenticated()) {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
