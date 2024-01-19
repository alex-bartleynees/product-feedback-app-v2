import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SuggestionEditRoutingModule } from './suggestion-edit-routing.module';
import { SuggestionEditComponent } from './suggestion-edit.component';

@NgModule({
  declarations: [SuggestionEditComponent],
  imports: [SharedModule, SuggestionEditRoutingModule],
})
export class SuggestionEditModule {}
