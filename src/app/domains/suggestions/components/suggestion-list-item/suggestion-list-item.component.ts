import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';
import {
  ChipComponent,
  CommentIconComponent,
} from '@product-feedback-app-v2/shared';

@Component({
    selector: 'product-feedback-app-v2-suggestion-list-item',
    templateUrl: './suggestion-list-item.component.html',
    styleUrls: ['./suggestion-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ChipComponent, CommentIconComponent]
})
export class SuggestionListItemComponent {
  suggestion = input<Suggestion | null>(null);

  @Output() upVoteClick = new EventEmitter<Suggestion>();
  @Output() suggestionSelectClick = new EventEmitter<Suggestion>();
}
