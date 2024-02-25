import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Suggestion,
  SuggestionComment,
  SuggestionCommentReplyRequest,
  SuggestionCommentRequest,
  SuggestionReply,
} from '@product-feedback-app-v2/api-interfaces';
import { SuggestionService } from '@product-feedback-app-v2/core-data';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, map, pipe, switchMap, tap } from 'rxjs';
import { withLoading } from '../utilities/with-loading';
import { tapResponse } from '@ngrx/operators';
import { withError } from '../utilities/with-error';

type SuggestionsState = {
  suggestions: Suggestion[];
  selectedId: number;
  selectedSuggestion: Suggestion | null;
};

const initialState: SuggestionsState = {
  suggestions: [],
  selectedId: 0,
  selectedSuggestion: null,
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
        return computed(() =>
          state.suggestions().filter((suggestion) => {
            return suggestion[category as keyof Suggestion] === prop;
          })
        );
      },
      upVoteSuggestion: rxMethod<Suggestion>(
        pipe(
          map((suggestion) => {
            const updatedSuggestion = {
              ...suggestion,
              upvotes: suggestion.upvotes + 1,
            };
            return updatedSuggestion;
          }),
          tap((updatedSuggestion) => {
            patchState(state, (state) => ({
              suggestions: state.suggestions.map((suggestion) =>
                suggestion.id === updatedSuggestion.id
                  ? updatedSuggestion
                  : suggestion
              ),
            }));
          }),
          concatMap((updatedSuggestion) => {
            return suggestionService.update(updatedSuggestion);
          })
        )
      ),
      selectSuggestion: rxMethod<number>(
        pipe(
          tap((id) => {
            patchState(state, () => ({
              selectedId: id,
            }));
          }),
          switchMap((id) => suggestionService.get(id)),
          tapResponse({
            next: (response) => {
              patchState(state, () => ({
                selectedSuggestion: response,
              }));
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
      createSuggestion: rxMethod<Suggestion>(
        pipe(
          switchMap((suggestion) => suggestionService.create(suggestion)),
          tapResponse({
            next: (response) => {
              patchState(state, (state) => ({
                suggestions: [response, ...state.suggestions],
              }));
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
      updateSuggestion: rxMethod<Suggestion>(
        pipe(
          tap((updatedSuggestion) => {
            patchState(state, (state) => ({
              suggestions: state.suggestions.map((suggestion) =>
                suggestion.id === updatedSuggestion.id
                  ? updatedSuggestion
                  : suggestion
              ),
            }));
          }),
          switchMap((updatedSuggestion) =>
            suggestionService.update(updatedSuggestion)
          ),
          tapResponse({
            next: (response) => {
              patchState(state, () => ({
                selectedSuggestion: response,
              }));
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
      deleteSuggestion: rxMethod<number>(
        pipe(
          tap((id) => {
            patchState(state, (state) => ({
              suggestions: state.suggestions.filter(
                (suggestion) => suggestion.id !== id
              ),
            }));
          }),
          concatMap((id) => suggestionService.delete(id)),
          tapResponse({
            next: () => {},
            error: (error: string) => state.setError(error),
          })
        )
      ),
      addCommentToSuggestion: rxMethod<SuggestionCommentRequest>(
        pipe(
          switchMap((comment) => suggestionService.addComment(comment)),
          tapResponse({
            next: (response) => {
              patchState(state, (state) => {
                const parentSuggestion = state.selectedSuggestion;
                if (parentSuggestion) {
                  const updatedSuggestion = {
                    ...parentSuggestion,
                    comments: parentSuggestion.comments
                      ? [...parentSuggestion.comments, response]
                      : [response],
                  };

                  return {
                    selectedSuggestion: updatedSuggestion,
                  };
                }

                return state;
              });
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
      createCommentReply: rxMethod<SuggestionCommentReplyRequest>(
        pipe(
          switchMap((reply) => suggestionService.addReply(reply)),
          tapResponse({
            next: (response) => {
              patchState(state, (state) => {
                const parentSuggestion = state.selectedSuggestion;
                const comment = parentSuggestion?.comments?.find(
                  (comment) => comment.id === response.suggestionCommentId
                );
                if (parentSuggestion?.comments && comment) {
                  const updatedReplies: SuggestionReply[] = [
                    ...(comment?.replies ?? []),
                    response,
                  ];
                  const updatedComment: SuggestionComment = {
                    ...comment,
                    replies: updatedReplies,
                  };
                  const index = parentSuggestion.comments.indexOf(comment);
                  const updatedComments: SuggestionComment[] = [
                    ...parentSuggestion.comments,
                  ];
                  updatedComments[index] = updatedComment;
                  return {
                    selectedSuggestion: {
                      ...parentSuggestion,
                      comments: updatedComments,
                    },
                  };
                }

                return state;
              });
            },
            error: (error: string) => state.setError(error),
          })
        )
      ),
      unselectSuggestion: () => {
        patchState(state, () => ({
          selectedId: 0,
          selectedSuggestion: null,
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
