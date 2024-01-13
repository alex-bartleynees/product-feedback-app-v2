import { Route } from '@angular/router';
import { SuggestionsComponent } from './domains/suggestions/suggestions.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: SuggestionsComponent,
  },
];
