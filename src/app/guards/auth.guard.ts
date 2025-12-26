import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersFacade } from '@product-feedback-app-v2/core-state';

/**
 * Auth guard to protect routes that require authentication.
 * Redirects to home page if user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const usersFacade = inject(UsersFacade);
  const router = inject(Router);

  if (usersFacade.isAuthenticated()) {
    return true;
  }

  // Redirect to home page if not authenticated
  router.navigate(['/']);
  return false;
};
