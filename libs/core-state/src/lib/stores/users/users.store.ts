import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User, BffUserResponse } from '@product-feedback-app-v2/api-interfaces';
import { withLoading } from '../utilities/with-loading';
import { withError } from '../utilities/with-error';
import { UsersService, AuthService } from '@product-feedback-app-v2/core-data';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, filter, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type UserState = {
  currentUser: User;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  currentUser: {} as User,
  isAuthenticated: false,
};

function getClaimValue(
  claims: BffUserResponse['claims'],
  type: string,
): string | undefined {
  return claims.find((claim) => claim.type === type)?.value;
}

export const UserStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withLoading(),
  withError(),
  withState(initialState),
  withMethods((state) => {
    const usersService = inject(UsersService);
    const authService = inject(AuthService);
    return {
      loadCurrentUser: rxMethod<void>(
        pipe(
          tap(() => state.setLoading(true)),
          switchMap(() => authService.getUserInfo()),
          tap((bffUser) => {
            if (!bffUser.isAuthenticated) {
              state.setLoading(false);
              patchState(state, { isAuthenticated: false });
            }
          }),
          filter((bffUser) => bffUser.isAuthenticated),
          map((bffUser) => {
            const sub = getClaimValue(bffUser.claims, 'sub');
            if (!sub) {
              throw new Error('No sub claim found in user info');
            }
            return sub;
          }),
          switchMap((sub) => usersService.getCurrentUser(sub)),
          tap(() => state.setLoading(false)),
          tapResponse({
            next: (response) => {
              patchState(state, {
                currentUser: response,
                isAuthenticated: true,
              });
            },
            error: (error: string) => state.setError(error),
          }),
        ),
      ),
      login: () => {
        authService.login();
      },
      logout: () => {
        authService.logout();
      },
      updateUserImage: (imageUrl: string) => {
        patchState(state, {
          currentUser: { ...state.currentUser(), image: imageUrl },
        });
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadCurrentUser();
    },
  }),
);
