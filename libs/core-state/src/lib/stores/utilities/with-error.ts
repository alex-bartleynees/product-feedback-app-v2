import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export const withError = () =>
  signalStoreFeature(
    withState<{ error: string | boolean }>({ error: false }),
    withMethods((state) => ({
      setError(value: string) {
        patchState(state, { error: value });
      },
    }))
  );
