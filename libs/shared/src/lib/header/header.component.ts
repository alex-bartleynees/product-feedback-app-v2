import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'product-feedback-app-v2-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, ButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() numberOfSuggestions: number | undefined = 0;
  @Input() menuItemSelected?: MenuItem;
  @Output() openMenu = new EventEmitter();
  @Output() addFeedbackButtonClick = new EventEmitter<void>();
  environment = environment;

  constructor(private router: Router) {}

  onAddFeedbackButtonClick() {
    this.router.navigate(['/suggestion']);
  }
}
