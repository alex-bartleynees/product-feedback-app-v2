import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chip } from '../../../../../libs/shared/src/lib/types/chip';
import { ChipComponent } from '../../../../../libs/shared/src/lib/chip/chip.component';
import { TileComponent } from '../../../../../libs/shared/src/lib/tile/tile.component';

@Component({
  selector: 'product-feedback-app-v2-chiplist-tile',
  templateUrl: './chiplist-tile.component.html',
  styleUrls: ['./chiplist-tile.component.scss'],
  standalone: true,
  imports: [CommonModule, ChipComponent, TileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipListTileComponent {
  @Input() chipList: Chip[] = [];
  @Output() chipSelected = new EventEmitter();
}
