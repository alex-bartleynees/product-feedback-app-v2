import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import {
  ChipComponent,
  CommentIconComponent,
} from '@product-feedback-app-v2/shared';
import { HoverPrefetchLinkDirective } from 'ngx-hover-preload';

@Component({
  selector: 'product-feedback-app-v2-suggestion-list-item',
  templateUrl: './suggestion-list-item.component.html',
  styleUrls: ['./suggestion-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChipComponent,
    CommentIconComponent,
    RouterLink,
    HoverPrefetchLinkDirective,
  ],
})
export class SuggestionListItemComponent {
  suggestion = input<Suggestion | null>(null);
  suggestionStore = inject(SuggestionsFacadeService);

  @Output() upVoteClick = new EventEmitter<Suggestion>();
}
