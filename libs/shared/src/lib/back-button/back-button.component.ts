import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'product-feedback-app-v2-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  environment = environment;
  constructor(private location: Location) {}

  onBackClick() {
    this.location.back();
  }
}
