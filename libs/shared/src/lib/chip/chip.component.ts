import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  input,
} from '@angular/core';
import { environment } from 'src/app/environments/environment';

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
  environment = environment;
  @Input() active = false;
  @Input() showArrow = false;
  @Input() usePointer = true;

  @Output() chipClick = new EventEmitter<string | number>();
}
