import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestionEditComponent } from './suggestion-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SuggestionEditComponent,
  },
  {
    path: ':id',
    component: SuggestionEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestionEditRoutingModule {}
