import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BffUserResponse } from '@product-feedback-app-v2/api-interfaces';
import { CsrfService } from '../csrf/csrf.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private csrfService = inject(CsrfService);
  private http = inject(HttpClient);

  getUserInfo(): Observable<BffUserResponse> {
    return this.http.get<BffUserResponse>('/bff/user', {
      withCredentials: true,
    });
  }

  login(): void {
    window.location.href = '/bff/login';
  }

  async logout(): Promise<void> {
    const csrfToken = this.csrfService.getToken();

    // Use fetch with redirect: 'manual' to avoid CORS issues
    // The BFF clears the session, we just don't follow the Keycloak redirect
    await fetch('/bff/logout', {
      method: 'POST',
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
      credentials: 'include',
      redirect: 'manual',
    });

    // Session cleared on server, redirect to home
    window.location.href = '/';
  }
}
