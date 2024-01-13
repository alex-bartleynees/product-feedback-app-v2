import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, User } from '@product-feedback-app-v2/api-interfaces';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private http: HttpClient
  ) {}

  usersModel = 'users';

  getCurrentUser(id: number): Observable<User> {
    return this.http.get<User>(this.getUrlForId(id));
  }

  private getUrl(model: string) {
    return `${this.appConfig.apiEndpoint}${model}`;
  }

  private getUrlForId(id: number) {
    return `${this.getUrl(this.usersModel)}/${id}`;
  }
}
