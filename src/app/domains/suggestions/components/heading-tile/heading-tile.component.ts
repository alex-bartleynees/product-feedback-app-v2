import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { TileComponent } from '../../../../../../libs/shared/src/lib/tile/tile.component';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'product-feedback-app-v2-heading-tile',
  templateUrl: './heading-tile.component.html',
  styleUrls: ['./heading-tile.component.scss'],
  standalone: true,
  imports: [CommonModule, TileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
