import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'product-feedback-app-v2-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() style = '';
}
