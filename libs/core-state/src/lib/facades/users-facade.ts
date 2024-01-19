import { Injectable, inject } from '@angular/core';
import { UserStore } from '../stores/users/users.store';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly store = inject(UserStore);
  currentUser = this.store.currentUser;
}
