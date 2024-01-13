import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SuggestionForm } from '../forms/suggestion-form';
import { MenuComponent, MenuItem } from '../menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-feedback-app-v2-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MenuComponent],
  animations: [
    trigger('arrowRotate', [
      state('up', style({ transform: 'rotate(180deg)' })),
      state('down', style({ transform: 'rotate(0deg)' })),
      transition('up => down', animate('200ms ease-in')),
      transition('down => up', animate('200ms ease-out')),
    ]),
  ],
})
export class SelectComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  @Input() suggestionForm: SuggestionForm = new SuggestionForm();
  @Input() control = '';
  @Input() menuItemSelected?: MenuItem;
  @Output() menuItemClick = new EventEmitter<void>();

  isMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).classList.contains('select')) {
      this.isMenuOpen = false;
    }
  }

  ngOnInit(): void {
    if (!this.menuItemSelected) {
      this.menuItemSelected = this.menuItems[0];
    }
    this.suggestionForm.controls[this.control].setValue(
      this.menuItemSelected.title
    );
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onMenuItemClick(menuItem: MenuItem) {
    this.menuItemSelected = menuItem;
    this.isMenuOpen = false;
    this.suggestionForm.controls[this.control].setValue(menuItem?.field);
  }
}
