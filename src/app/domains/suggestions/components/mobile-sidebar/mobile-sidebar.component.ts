import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChipListTileComponent } from '../chiplist-tile/chiplist-tile.component';
import { RoadMapTileComponent } from '../roadmap-tile/roadmap-tile.component';
import { Chip } from '@product-feedback-app-v2/shared';

@Component({
    selector: 'product-feedback-app-v2-mobile-sidebar',
    templateUrl: './mobile-sidebar.component.html',
    styleUrls: ['./mobile-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ChipListTileComponent, RoadMapTileComponent],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(-100%)' })),
            ]),
        ]),
    ]
})
export class MobileSidebarComponent {
  @Input() chipList: Chip[] = [];
  @Output() chipSelected = new EventEmitter();
}
