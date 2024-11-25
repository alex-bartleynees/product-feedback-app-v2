import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  SortBy,
  SortPipe,
} from '@product-feedback-app-v2/shared';
import { SuggestionListItemComponent } from '../suggestion-list-item/suggestion-list-item.component';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'product-feedback-app-v2-suggestions-list',
  templateUrl: './suggestions-list.component.html',
  styleUrls: ['./suggestions-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SuggestionListItemComponent,
    SortPipe,
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionsListComponent {
  @Input() allSuggestions?: Suggestion[];
  @Input() sortBy: SortBy = { key: 'upvotes', order: 'desc' };

  @Output() upVoteClick = new EventEmitter<Suggestion>();
  @Output() suggestionSelectClick = new EventEmitter<Suggestion>();
  @Output() addFeedbackButtonClick = new EventEmitter<void>();

  readonly suggestionsFacade = inject(SuggestionsFacadeService);
  environment = environment;

  constructor(private router: Router) {}

  onButtonClick() {
    this.router.navigate(['/suggestion']);
  }
}
