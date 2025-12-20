import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppConfig, User } from '@product-feedback-app-v2/api-interfaces';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private appConfig = inject<AppConfig>(APP_CONFIG);
  private http = inject(HttpClient);


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
