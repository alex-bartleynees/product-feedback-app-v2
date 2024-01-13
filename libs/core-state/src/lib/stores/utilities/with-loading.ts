import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export const withLoading = () =>
  signalStoreFeature(
    withState({ loaded: false }),
    withMethods((state) => ({
      setLoading(value: boolean) {
        patchState(state, { loaded: value });
      },
    }))
  );
