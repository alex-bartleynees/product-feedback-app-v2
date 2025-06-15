import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion, User } from '@product-feedback-app-v2/api-interfaces';
import { Subject } from 'rxjs';

import {
  BackButtonComponent,
  ButtonComponent,
  ControlErrorsDirective,
  FormSubmitDirective,
  MenuItem,
  SelectComponent,
  SuggestionForm,
} from '@product-feedback-app-v2/shared';
import {
  SuggestionsFacadeService,
  UsersFacade,
} from '@product-feedback-app-v2/core-state';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'product-feedback-app-v2-suggestion-edit',
  templateUrl: './suggestion-edit.component.html',
  styleUrls: ['./suggestion-edit.component.scss'],
  imports: [
    ReactiveFormsModule,
    BackButtonComponent,
    ButtonComponent,
    SelectComponent,
    FormSubmitDirective,
    ControlErrorsDirective
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionEditComponent implements OnInit, OnDestroy {
  editMode = signal(false);
  id?: number;
  suggestionForm = computed(() =>
    this.editMode()
      ? new SuggestionForm(this.selectedSuggestion())
      : new SuggestionForm(),
  );
  editTitle = computed(() =>
    this.editMode()
      ? `Editing '${this.selectedSuggestion()?.title}`
      : 'Create New Feedback',
  );
  selectedSuggestion = this.suggestionService.selectedSuggestion;
  currentUser: User = this.usersFacade.currentUser();
  environment = environment;

  menuItems: MenuItem[] = [
    {
      title: 'Feature',
      field: 'feature',
    },
    {
      title: 'UI',
      field: 'ui',
    },
    {
      title: 'UX',
      field: 'ux',
    },
    {
      title: 'Enhancement',
      field: 'enhancement',
    },
    {
      title: 'Bug',
      field: 'bug',
    },
  ];

  statusItems: MenuItem[] = [
    {
      title: 'Suggestion',
      field: 'suggestion',
    },
    {
      title: 'Planned',
      field: 'planned',
    },
    {
      title: 'In-Progress',
      field: 'in-progress',
    },
    {
      title: 'Live',
      field: 'live',
    },
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionsFacadeService,
    private usersFacade: UsersFacade,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      this.editMode.set(true);
      this.suggestionService.selectSuggestion(+id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.suggestionService.unselectSuggestion();
  }

  onSubmit() {
    if (!this.suggestionForm().valid) {
      return;
    }

    if (this.editMode() && this.selectedSuggestion) {
      const suggestion: Suggestion = {
        id: this.id,
        title: this.suggestionForm().title.value,
        category: this.suggestionForm().category.value,
        upvotes: this.selectedSuggestion()!.upvotes,
        status: this.suggestionForm().statusControl.value,
        description: this.suggestionForm().description.value,
        comments: this.selectedSuggestion()!.comments,
      };

      this.suggestionService.updateSuggestion(suggestion);
    } else {
      const suggestion: Suggestion = {
        title: this.suggestionForm().title.value,
        category: this.suggestionForm().category.value,
        upvotes: 0,
        status: '',
        description: this.suggestionForm().description.value,
        comments: [],
      };

      this.suggestionService.createSuggestion(suggestion);
    }

    this.router.navigate(['/']);
  }

  onCancelButtonClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }

  onDeleteButtonClick(event: Event) {
    if (!this.id) {
      return;
    }

    event.preventDefault();
    this.suggestionService.deleteSuggestion(this.id);
    this.router.navigate(['/']);
  }
}
