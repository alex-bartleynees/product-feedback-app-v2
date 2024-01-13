import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SuggestionsStore } from '@product-feedback-app-v2/core-state';
import { TileComponent } from '@product-feedback-app-v2/shared';

@Component({
  selector: 'product-feedback-app-v2-roadmap-tile',
  templateUrl: './roadmap-tile.component.html',
  styleUrls: ['./roadmap-tile.component.scss'],
  standalone: true,
  imports: [CommonModule, TileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadMapTileComponent {
  suggestionsStore = inject(SuggestionsStore);
  plannedSuggestions = this.suggestionsStore.filterSuggestions(
    'status',
    'planned'
  );
  inProgressSuggestions = this.suggestionsStore.filterSuggestions(
    'status',
    'in-progress'
  );
  liveSuggestions = this.suggestionsStore.filterSuggestions('status', 'live');
}
