import { Route } from '@angular/router';
import { SuggestionsComponent } from './domains/suggestions/suggestions.component';
import { authGuard } from './guards/auth.guard';

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
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './domains/suggestions/pages/suggestion-edit/suggestion-edit.component'
      ).then((mod) => mod.SuggestionEditComponent),
  },
  {
    path: 'suggestion/:id',
    canActivate: [authGuard],
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
  {
    path: 'register',
    loadComponent: () =>
      import('./domains/auth/pages/register/register.component').then(
        (mod) => mod.RegisterComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./domains/auth/pages/profile/profile.component').then(
        (mod) => mod.ProfileComponent
      ),
  },
];
