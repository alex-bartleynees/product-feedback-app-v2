import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import {
  ChipComponent,
  CommentIconComponent,
} from '@product-feedback-app-v2/shared';

@Component({
  selector: 'product-feedback-app-v2-road-map-card',
  templateUrl: './road-map-card.component.html',
  styleUrls: ['./road-map-card.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ChipComponent, CommentIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadMapCardComponent {
  @Input() suggestion?: Suggestion;

  constructor(private suggestionsFacade: SuggestionsFacadeService) {}

  handleUpVoteClick(suggestion: Suggestion) {
    this.suggestionsFacade.upVoteSuggestion(suggestion);
  }
}
