
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { TileComponent } from '@product-feedback-app-v2/shared';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'product-feedback-app-v2-heading-tile',
    templateUrl: './heading-tile.component.html',
    styleUrls: ['./heading-tile.component.scss'],
    imports: [TileComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingTileComponent {
  showMobileSidebar = false;
  environment = environment;
  @Output() mobileSideBarClick = new EventEmitter();

  onMobileSideBarClick() {
    this.showMobileSidebar = !this.showMobileSidebar;
    this.mobileSideBarClick.emit();
  }
}
