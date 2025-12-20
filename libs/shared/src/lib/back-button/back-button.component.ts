import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
    selector: 'product-feedback-app-v2-back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss'],
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackButtonComponent {
  private location = inject(Location);

  onBackClick() {
    this.location.back();
  }
}
