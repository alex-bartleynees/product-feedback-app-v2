import { Injectable, inject, computed, Signal } from '@angular/core';
import { SuggestionsStore } from '../stores/suggestions/suggestions.store';
import {
  Suggestion,
  SuggestionCommentReplyRequest,
  SuggestionCommentRequest,
} from '@product-feedback-app-v2/api-interfaces';
import { SuggestionsSignalService } from '../stores/suggestions/suggestions-signal-service';

@Injectable({
  providedIn: 'root',
})
export class SuggestionsFacadeService {
  private readonly store = inject(SuggestionsSignalService);
  loading = this.store.state().loading;
  loadError = this.store.state().error;
  allSuggestions = computed(() => this.store.state().suggestions());
  selectedSuggestion = computed(() => {
    return this.store.state().selectedSuggestion();
  });

  plannedSuggestions = computed(() =>
    this.store
      .state()
      .suggestions()
      .filter((suggestion) => suggestion.status === 'planned')
  );
  inProgressSuggestions = computed(() =>
    this.store
      .state()
      .suggestions()
      .filter((suggestion) => suggestion.status === 'in-progress')
  );
  liveSuggestions = computed(() =>
    this.store
      .state()
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
    this.store.selectSuggestion(suggestionId);
  }

  upVoteSuggestion(suggestion: Suggestion): void {
    this.store.upVoteSuggestion(suggestion);
  }

  updateSuggestion(updatedSuggestion: Suggestion): void {
    // this.store.updateSuggestion(updatedSuggestion);
  }

  createSuggestion(suggestion: Suggestion): void {
    // this.store.createSuggestion(suggestion);
  }

  addCommentToSuggestion(comment: SuggestionCommentRequest): void {
    // this.store.addCommentToSuggestion(comment);
  }

  addReplyToComment(reply: SuggestionCommentReplyRequest) {
    // this.store.createCommentReply(reply);
  }

  deleteSuggestion(id: number): void {
    // this.store.deleteSuggestion(id);
  }

  unselectSuggestion(): void {
    this.store.unselectSuggestion();
  }
}
