import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { SuggestionsComponent } from './suggestions.component';

describe('SuggestionsComponent', () => {
  let component: SuggestionsComponent;
  let fixture: ComponentFixture<SuggestionsComponent>;

  beforeEach(async () => {
    const mockSuggestionsFacade = {
      allSuggestions: signal([]),
      loading: signal(false),
      loadError: signal(null),
      selectedSuggestion: signal(null),
      filterSuggestions: () => signal([]),
      plannedSuggestions: signal([]),
      inProgressSuggestions: signal([]),
      liveSuggestions: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [SuggestionsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
        { provide: SuggestionsFacadeService, useValue: mockSuggestionsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
