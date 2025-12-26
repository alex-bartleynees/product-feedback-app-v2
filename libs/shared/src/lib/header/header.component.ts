import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../menu/menu.component';
import { UsersFacade } from '@product-feedback-app-v2/core-state';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'product-feedback-app-v2-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [ButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  usersFacade = inject(UsersFacade);

  @Input() numberOfSuggestions: number | undefined = 0;
  @Input() menuItemSelected?: MenuItem;
  @Output() openMenu = new EventEmitter();
  @Output() addFeedbackButtonClick = new EventEmitter<void>();

  onAddFeedbackButtonClick() {
    this.router.navigate(['/suggestion']);
  }

  onLogin() {
    this.usersFacade.login();
  }

  onLogout() {
    this.usersFacade.logout();
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }
}
