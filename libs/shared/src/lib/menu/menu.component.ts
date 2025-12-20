import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortBy } from '../types/sort-by';

export interface MenuItem {
  title: string;
  field?: string;
  sortBy?: SortBy;
}

@Component({
    selector: 'product-feedback-app-v2-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() itemSelected?: MenuItem;
  @Output() menuItemClicked = new EventEmitter<MenuItem>();
}
