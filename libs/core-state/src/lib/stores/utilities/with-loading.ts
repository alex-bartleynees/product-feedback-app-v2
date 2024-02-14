import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export const withLoading = () =>
  signalStoreFeature(
    withState({ loading: false }),
    withMethods((state) => ({
      setLoading(value: boolean) {
        patchState(state, { loading: value });
      },
    }))
  );
