import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import { TileComponent } from '@product-feedback-app-v2/shared';

@Component({
    selector: 'product-feedback-app-v2-roadmap-tile',
    templateUrl: './roadmap-tile.component.html',
    styleUrls: ['./roadmap-tile.component.scss'],
    imports: [CommonModule, TileComponent, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadMapTileComponent {
  private readonly suggestionsFacade = inject(SuggestionsFacadeService);
  plannedSuggestions = this.suggestionsFacade.plannedSuggestions;
  inProgressSuggestions = this.suggestionsFacade.inProgressSuggestions;
  liveSuggestions = this.suggestionsFacade.liveSuggestions;
}
