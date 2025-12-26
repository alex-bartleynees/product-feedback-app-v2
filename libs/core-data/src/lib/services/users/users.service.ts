import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AppConfig,
  ImageUploadResultDto,
  User,
  UserForCreationDto,
} from '@product-feedback-app-v2/api-interfaces';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private appConfig = inject<AppConfig>(APP_CONFIG);
  private http = inject(HttpClient);


  usersModel = 'users';

  getCurrentUser(id: string): Observable<User> {
    return this.http.get<User>(this.getUrlForId(id));
  }

  createUser(user: UserForCreationDto): Observable<User> {
    return this.http.post<User>(this.getUrl(this.usersModel), user);
  }

  uploadProfileImage(userId: string, file: File): Observable<ImageUploadResultDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageUploadResultDto>(
      `${this.getUrlForId(userId)}/profile-image`,
      formData,
    );
  }

  private getUrl(model: string) {
    return `${this.appConfig.apiEndpoint}${model}`;
  }

  private getUrlForId(id: string) {
    return `${this.getUrl(this.usersModel)}/${id}`;
  }
}
