import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'product-feedback-app-v2-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {
  @Input() radial = false;
}
