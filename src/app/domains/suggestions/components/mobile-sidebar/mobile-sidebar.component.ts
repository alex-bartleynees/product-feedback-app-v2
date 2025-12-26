import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

import { ChipListTileComponent } from '../chiplist-tile/chiplist-tile.component';
import { RoadMapTileComponent } from '../roadmap-tile/roadmap-tile.component';
import { ButtonComponent, Chip } from '@product-feedback-app-v2/shared';
import { UsersFacade } from '@product-feedback-app-v2/core-state';

@Component({
    selector: 'product-feedback-app-v2-mobile-sidebar',
    templateUrl: './mobile-sidebar.component.html',
    styleUrls: ['./mobile-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChipListTileComponent, RoadMapTileComponent, ButtonComponent],
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
  private router = inject(Router);
  usersFacade = inject(UsersFacade);

  @Input() chipList: Chip[] = [];
  @Output() chipSelected = new EventEmitter();

  onProfileClick(): void {
    this.router.navigate(['/profile']);
  }

  onLogoutClick(): void {
    this.usersFacade.logout();
  }
}
