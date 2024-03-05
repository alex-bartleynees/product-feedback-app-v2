import {
  DestroyRef,
  Injectable,
  Injector,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SuggestionService } from '@product-feedback-app-v2/core-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';

type SuggestionsState = {
  suggestions: Signal<Suggestion[]>;
  selectedId: number;
  selectedSuggestion: Signal<Suggestion | null>;
  loading: Signal<boolean>;
  error: Signal<string | boolean>;
};

@Injectable({
  providedIn: 'root',
})
export class SuggestionsSignalService {
  suggestionsService = inject(SuggestionService);
  destroyRef = inject(Injector);
  state: Signal<SuggestionsState> = computed(() => ({
    suggestions: signal([]),
    selectedId: 0,
    selectedSuggestion: signal(null),
    loading: signal(false),
    error: signal(false),
  }));
  load() {
    const suggestions = toSignal(this.suggestionsService.all(), {
      initialValue: [],
      injector: this.destroyRef,
    });
    this.state().suggestions = suggestions;
  }

  filterSuggestions(category: string, prop: string) {
    return computed(() =>
      this.state()
        .suggestions()
        .filter((suggestion) => {
          return suggestion[category as keyof Suggestion] === prop;
        })
    );
  }

  upVoteSuggestion(suggestion: Suggestion) {
    const suggestionToUpdate = {
      ...suggestion,
      upvotes: suggestion.upvotes + 1,
    };

    this.suggestionsService
      .update(suggestionToUpdate)
      .subscribe((updatedSuggestion) => {
        this.state()
          .suggestions()
          .map((suggestion) =>
            suggestion.id === updatedSuggestion.id
              ? updatedSuggestion
              : suggestion
          );
      });
  }

  selectSuggestion(selectedId: number) {
    this.state().selectedId = selectedId;
    const suggestion = toSignal(this.suggestionsService.get(selectedId), {
      initialValue: null,
    });
    this.state().selectedSuggestion = suggestion;
  }

  createSuggestion() {}

  updateSuggestion() {}

  deleteSuggestion() {}

  addCommentToSuggestion() {}

  createCommentReply() {}

  unselectSuggestion() {}
}
