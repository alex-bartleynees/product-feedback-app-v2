import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  input,
} from '@angular/core';

@Component({
    selector: 'product-feedback-app-v2-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
  text = input<string | number>('');
  @Input() active = false;
  @Input() showArrow = false;
  @Input() usePointer = true;

  @Output() chipClick = new EventEmitter<string | number>();
}
