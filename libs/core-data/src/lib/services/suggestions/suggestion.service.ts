import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AppConfig,
  Suggestion,
  SuggestionCommentReplyResponse,
  SuggestionCommentRequest,
  SuggestionCommentResponse,
} from '@product-feedback-app-v2/api-interfaces';
import { catchError, Observable, throwError } from 'rxjs';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private http: HttpClient
  ) {}

  suggestionsModel = 'suggestions';
  commentModel = 'comment';

  all(): Observable<Suggestion[]> {
    return this.http
      .get<Suggestion[]>(this.getUrl(this.suggestionsModel))
      .pipe(catchError((error) => throwError(() => error)));
  }

  update(suggestion: Suggestion): Observable<Suggestion> {
    if (!suggestion.id) {
      throw new Error('Suggestion must have an id');
    }
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
    return this.http
      .post<SuggestionCommentReplyResponse>(
        `${this.getUrl(this.commentModel)}/reply`,
        comment
      )
      .pipe(catchError((error) => throwError(() => error)));
  }

  delete(id: number): Observable<number> {
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
