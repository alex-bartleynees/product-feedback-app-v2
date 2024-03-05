import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';

@Component({
  selector: 'product-feedback-app-v2-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  text = input<string | number>('');
  active = input(false);
  showArrow = input(false);
  usePointer = input(false);

  @Output() chipClick = new EventEmitter<string | number>();
}
