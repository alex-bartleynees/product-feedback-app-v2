import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  Chip,
  ChipComponent,
  TileComponent,
} from '@product-feedback-app-v2/shared';

@Component({
    selector: 'product-feedback-app-v2-chiplist-tile',
    templateUrl: './chiplist-tile.component.html',
    styleUrls: ['./chiplist-tile.component.scss'],
    imports: [ChipComponent, TileComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipListTileComponent {
  @Input() chipList: Chip[] = [];
  @Output() chipSelected = new EventEmitter();
}
