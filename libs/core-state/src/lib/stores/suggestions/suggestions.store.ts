import { inject, signal } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';
import { SuggestionService } from '@product-feedback-app-v2/core-data';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { withLoading } from '../utilities/with-loading';
import { tapResponse } from '@ngrx/operators';
import { withError } from '../utilities/with-error';

type SuggestionsState = {
  suggestions: Suggestion[];
  selectedId?: number;
};

const initialState: SuggestionsState = {
  suggestions: [],
  selectedId: undefined,
};

export const SuggestionsStore = signalStore(
  { providedIn: 'root' },
  withLoading(),
  withError(),
  withState(initialState),
  withMethods((state) => {
    const suggestionService = inject(SuggestionService);
    return {
      load: rxMethod<void>(
        pipe(
          tap(() => state.setLoading(true)),
          switchMap(() => suggestionService.all()),
          tap(() => state.setLoading(false)),
          tapResponse({
            next: (response) => {
              patchState(state, {
                suggestions: response,
              });
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
      filterSuggestions: (category: string, prop: string) => {
        return signal(
          state
            .suggestions()
            .filter(
              (suggestion) => suggestion[category as keyof Suggestion] === prop
            )
        );
      },
      upVoteSuggestion: (suggestion: Suggestion) => {
        const updatedSuggestion = {
          ...suggestion,
          upvotes: suggestion.upvotes + 1,
        };
        patchState(state, (state) => ({
          suggestions: state.suggestions.map((suggestion) =>
            suggestion.id === updatedSuggestion.id
              ? updatedSuggestion
              : suggestion
          ),
        }));
      },
      selectSuggestion: (number) => {
        patchState(state, () => ({
          selectedId: number,
        }));
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.load();
    },
  })
);
