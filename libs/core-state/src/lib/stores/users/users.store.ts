import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '@product-feedback-app-v2/api-interfaces';
import { withLoading } from '../utilities/with-loading';
import { withError } from '../utilities/with-error';
import { UsersService } from '@product-feedback-app-v2/core-data';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type UserState = {
  currentUser: User;
};

const initialState: UserState = {
  currentUser: {} as User,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withLoading(),
  withError(),
  withState(initialState),
  withMethods((state) => {
    const usersService = inject(UsersService);
    return {
      load: rxMethod<number>(
        pipe(
          tap(() => state.setLoading(true)),
          switchMap((id) => usersService.getCurrentUser(id)),
          tap(() => state.setLoading(false)),
          tapResponse({
            next: (response) => {
              patchState(state, {
                currentUser: response,
              });
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.load(3);
    },
  })
);
