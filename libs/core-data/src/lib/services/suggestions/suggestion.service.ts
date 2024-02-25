import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AppConfig,
  Suggestion,
  SuggestionCommentReplyResponse,
  SuggestionCommentRequest,
  SuggestionCommentResponse,
} from '@product-feedback-app-v2/api-interfaces';
import { catchError, Observable, of, retry, tap, throwError } from 'rxjs';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  suggestionsCache = new Map<number, Suggestion>();
  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private http: HttpClient
  ) {}

  suggestionsModel = 'suggestions';
  commentModel = 'comment';
  retryConfig = { count: 3, delay: 1000, resetOnSuccess: true };

  all(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.getUrl(this.suggestionsModel)).pipe(
      retry(this.retryConfig),
      catchError((error) => throwError(() => error))
    );
  }

  get(id: number): Observable<Suggestion> {
    if (this.suggestionsCache.has(id)) {
      return of(this.suggestionsCache.get(id) as Suggestion);
    }
    return this.http.get<Suggestion>(this.getUrlForId(id)).pipe(
      tap((s) => {
        if (s.id) {
          this.suggestionsCache.set(s.id, s);
        }
      })
    );
  }

  update(suggestion: Suggestion): Observable<Suggestion> {
    if (!suggestion.id) {
      throw new Error('Suggestion must have an id');
    }

    this.suggestionsCache.delete(suggestion.id);

    return this.http
      .put<Suggestion>(this.getUrlForId(suggestion.id), suggestion)
      .pipe(catchError((error) => throwError(() => error)));
  }

  create(suggestion: Suggestion): Observable<Suggestion> {
    return this.http
      .post<Suggestion>(this.getUrl(this.suggestionsModel), suggestion)
      .pipe(catchError((error) => throwError(() => error)));
  }

  addComment(
    comment: SuggestionCommentRequest
  ): Observable<SuggestionCommentResponse> {
    if (comment.suggestionId) {
      this.suggestionsCache.delete(comment.suggestionId);
    }
    return this.http
      .post<SuggestionCommentResponse>(
        `${this.getUrl(this.commentModel)}`,
        comment
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  addReply(
    comment: SuggestionCommentRequest
  ): Observable<SuggestionCommentReplyResponse> {
    if (comment.suggestionId) {
      this.suggestionsCache.delete(comment.suggestionId);
    }
    return this.http
      .post<SuggestionCommentReplyResponse>(
        `${this.getUrl(this.commentModel)}/reply`,
        comment
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  delete(id: number): Observable<number> {
    this.suggestionsCache.delete(id);
    return this.http
      .delete<number>(this.getUrlForId(id))
      .pipe(catchError((error) => throwError(() => error)));
  }

  private getUrl(model: string) {
    return `${this.appConfig.apiEndpoint}${model}`;
  }

  private getUrlForId(id: number) {
    return `${this.getUrl(this.suggestionsModel)}/${id}`;
  }
}
