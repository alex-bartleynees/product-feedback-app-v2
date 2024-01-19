import { Route } from '@angular/router';
import { SuggestionsComponent } from './domains/suggestions/suggestions.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: SuggestionsComponent,
  },
  {
    path: 'suggestion-detail/:id',
    loadComponent: () =>
      import(
        './domains/suggestions/pages/suggestion-detail/suggestion-detail.component'
      ).then((mod) => mod.SuggestionDetailComponent),
  },
  {
    path: 'suggestion',
    loadComponent: () =>
      import(
        './domains/suggestions/pages/suggestion-edit/suggestion-edit.component'
      ).then((mod) => mod.SuggestionEditComponent),
  },
  {
    path: 'suggestion/:id',
    loadComponent: () =>
      import(
        './domains/suggestions/pages/suggestion-edit/suggestion-edit.component'
      ).then((mod) => mod.SuggestionEditComponent),
  },
  {
    path: 'road-map',
    loadComponent: () =>
      import('./domains/road-map/road-map.component').then(
        (mod) => mod.RoadMapComponent
      ),
  },
];
