import { Injectable, inject } from '@angular/core';
import { UserStore } from '../stores/users/users.store';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly store = inject(UserStore);

  currentUser = this.store.currentUser;
  isAuthenticated = this.store.isAuthenticated;

  loadCurrentUser(): void {
    this.store.loadCurrentUser();
  }

  login(): void {
    this.store.login();
  }

  logout(): void {
    this.store.logout();
  }

  updateUserImage(imageUrl: string): void {
    this.store.updateUserImage(imageUrl);
  }
}
