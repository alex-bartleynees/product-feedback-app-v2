import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  Signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import { HeadingTileComponent } from './components/heading-tile/heading-tile.component';
import { ChipListTileComponent } from './components/chiplist-tile/chiplist-tile.component';
import { RoadMapTileComponent } from './components/roadmap-tile/roadmap-tile.component';
import {
  Chip,
  HeaderComponent,
  MenuComponent,
  MenuItem,
  SortBy,
} from '@product-feedback-app-v2/shared';
import { SuggestionsListComponent } from './components/suggestions-list/suggestions-list.component';
import { MobileSidebarComponent } from './components/mobile-sidebar/mobile-sidebar.component';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'product-feedback-app-v2-suggestions',
  standalone: true,
  imports: [
    CommonModule,
    HeadingTileComponent,
    ChipListTileComponent,
    RoadMapTileComponent,
    HeaderComponent,
    MenuComponent,
    SuggestionsListComponent,
    MobileSidebarComponent,
  ],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionsComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  showMobileSidebar = false;
  sortBy: SortBy = { key: 'upvotes', order: 'desc' };
  chipList: Chip[] = [
    {
      text: 'All',
      active: true,
    },
    {
      text: 'UI',
      active: false,
    },
    {
      text: 'UX',
      active: false,
    },
    {
      text: 'Enhancement',
      active: false,
    },
    {
      text: 'Bug',
      active: false,
    },
    {
      text: 'Feature',
      active: false,
    },
  ];
  menuItems: MenuItem[] = [
    {
      title: 'Most Upvotes',
      sortBy: {
        key: 'upvotes',
        order: 'desc',
      },
    },
    {
      title: 'Least Upvotes',
      sortBy: {
        key: 'upvotes',
        order: 'asc',
      },
    },
    {
      title: 'Most Comments',
      sortBy: {
        key: 'commentCount',
        order: 'desc',
      },
    },
    {
      title: 'Least Comments',
      sortBy: {
        key: 'commentCount',
        order: 'asc',
      },
    },
  ];
  menuItemSelected: MenuItem = this.menuItems[0];
  environment = environment;

  private readonly suggestionsFacade = inject(SuggestionsFacadeService);
  allSuggestions = this.suggestionsFacade.allSuggestions;

  constructor(
    private router: Router,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.renderer.addClass(document.body, 'suggestions');
    }
  }

  onChipClick(event: { chipList: Chip[]; chip: Chip }): void {
    const { chipList, chip } = event;

    if (chip.text === 'All') {
      this.allSuggestions = this.suggestionsFacade.allSuggestions;
      this.resetChipList(chipList, chip);
      return;
    }

    this.allSuggestions = this.filterSuggestions('category', chip);
    this.resetChipList(chipList, chip);
  }

  filterSuggestions(key: string, chip: Chip): Signal<Suggestion[]> {
    return this.suggestionsFacade.filterSuggestions(
      key,
      chip.text.toLowerCase(),
    );
  }

  resetChipList(chipList: Chip[], chip: Chip): void {
    chipList.forEach((c) => (c.active = false));
    chip.active = true;
  }

  onMenuItemClick(menuItem: MenuItem): void {
    if (menuItem.sortBy) {
      this.sortBy = menuItem.sortBy;
    }
    this.menuItemSelected = menuItem;
    this.isMenuOpen = false;
  }

  onUpVoteClick(suggestion: Suggestion): void {
    this.suggestionsFacade.upVoteSuggestion(suggestion);
  }

  onSuggestionClick(suggestion: Suggestion): void {
    if (!suggestion.id) {
      return;
    }
    this.suggestionsFacade.selectSuggestion(suggestion.id);
    this.router.navigate(['/suggestion-detail', suggestion.id]);
  }

  openMobileSideBar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      this.renderer.removeClass(document.body, 'suggestions');
    }
  }
}
