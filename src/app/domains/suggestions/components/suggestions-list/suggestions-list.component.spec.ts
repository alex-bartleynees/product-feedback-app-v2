import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { signal } from '@angular/core';

import { SuggestionsListComponent } from './suggestions-list.component';

describe('SuggestionsListComponent', () => {
  let component: SuggestionsListComponent;
  let fixture: ComponentFixture<SuggestionsListComponent>;

  beforeEach(async () => {
    const mockFacade = {
      allSuggestions: signal([]),
      loading: signal(false),
      loadError: signal(null),
      selectedSuggestion: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [SuggestionsListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
        { provide: SuggestionsFacadeService, useValue: mockFacade },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
