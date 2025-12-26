import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AntiforgeryResponse {
  requestToken: string;
}

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private readonly http = inject(HttpClient);
  private csrfToken: string | null = null;

  /**
   * Fetches the CSRF token from the BFF antiforgery endpoint.
   * This should be called during app initialization.
   */
  fetchCsrfToken(): Observable<AntiforgeryResponse> {
    return this.http.get<AntiforgeryResponse>('/bff/antiforgery').pipe(
      tap((response) => {
        this.csrfToken = response.requestToken;
      })
    );
  }

  /**
   * Returns the current CSRF token, or null if not yet fetched.
   */
  getToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Clears the stored CSRF token.
   * Useful after logout or when token needs to be refreshed.
   */
  clearToken(): void {
    this.csrfToken = null;
  }
}
