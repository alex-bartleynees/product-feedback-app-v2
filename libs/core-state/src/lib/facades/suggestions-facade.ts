import { Injectable, inject, computed, Signal } from '@angular/core';
import { SuggestionsStore } from '../stores/suggestions/suggestions.store';
import {
  Suggestion,
  SuggestionCommentRequest,
} from '@product-feedback-app-v2/api-interfaces';
import { patchState } from '@ngrx/signals';

@Injectable({
  providedIn: 'root',
})
export class SuggestionsFacadeService {
  private readonly store = inject(SuggestionsStore);
  loaded = this.store.loaded;
  loadError = this.store.error;
  allSuggestions = this.store.suggestions;
  selectedSuggestion = computed(() =>
    this.store
      .suggestions()
      .find((sugggestion) => sugggestion.id === this.store.selectedId())
  );

  plannedSuggestions = computed(() =>
    this.store
      .suggestions()
      .filter((suggestion) => suggestion.status === 'planned')
  );
  inProgressSuggestions = computed(() =>
    this.store
      .suggestions()
      .filter((suggestion) => suggestion.status === 'in-progress')
  );
  liveSuggestions = computed(() =>
    this.store
      .suggestions()
      .filter((suggestion) => suggestion.status === 'live')
  );

  filterSuggestions(category: string, prop: string): Signal<Suggestion[]> {
    return this.store.filterSuggestions(category, prop);
  }

  loadSuggestions(): void {
    this.store.load();
  }

  selectSuggestion(suggestionId: number): void {
    patchState(this.store, () => ({
      selectedId: suggestionId,
    }));
  }

  upVoteSuggestion(suggestion: Suggestion): void {
    this.store.upVoteSuggestion(suggestion);
  }

  updateSuggestion(updatedSuggestion: Suggestion): void {
    this.store.updateSuggestion(updatedSuggestion);
  }

  createSuggestion(suggestion: Suggestion): void {
    this.store.createSuggestion(suggestion);
  }

  addCommentToSuggestion(comment: SuggestionCommentRequest): void {
    this.store.addCommentToSuggestion(comment);
  }

  //   addReplyToComment(reply: SuggestionCommentReplyRequest) {
  //     this.store.createCommentReply(reply );
  //   }

  deleteSuggestion(id: number): void {
    this.store.deleteSuggestion(id);
  }
}
