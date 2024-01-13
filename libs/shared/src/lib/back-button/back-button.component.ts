import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'product-feedback-app-v2-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  constructor(private location: Location) {}

  onBackClick() {
    this.location.back();
  }
}
