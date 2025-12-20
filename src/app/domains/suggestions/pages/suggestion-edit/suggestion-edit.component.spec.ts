import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { SuggestionsFacadeService, UsersFacade } from '@product-feedback-app-v2/core-state';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';

import { SuggestionEditComponent } from './suggestion-edit.component';

describe('SuggestionEditComponent', () => {
  let component: SuggestionEditComponent;
  let fixture: ComponentFixture<SuggestionEditComponent>;

  beforeEach(async () => {
    const mockSuggestionsFacade = {
      selectedSuggestion: signal(null),
      suggestions: signal([]),
      loading: signal(false),
      error: signal(null),
      selectSuggestion: () => {},
      unselectSuggestion: () => {},
      updateSuggestion: () => {},
      createSuggestion: () => {},
    };

    const mockUsersFacade = {
      currentUser: signal({ id: 1, name: 'Test User', username: 'testuser', image: '' }),
    };

    await TestBed.configureTestingModule({
      imports: [SuggestionEditComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
        { provide: SuggestionsFacadeService, useValue: mockSuggestionsFacade },
        { provide: UsersFacade, useValue: mockUsersFacade },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
