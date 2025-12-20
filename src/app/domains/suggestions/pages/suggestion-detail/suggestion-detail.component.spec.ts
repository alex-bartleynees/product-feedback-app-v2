import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { SuggestionsFacadeService, UsersFacade } from '@product-feedback-app-v2/core-state';
import { APP_CONFIG } from '@product-feedback-app-v2/app-config';

import { SuggestionDetailComponent } from './suggestion-detail.component';

describe('SuggestionDetailComponent', () => {
  let component: SuggestionDetailComponent;
  let fixture: ComponentFixture<SuggestionDetailComponent>;

  beforeEach(async () => {
    const mockSuggestionsFacade = {
      selectedSuggestion: signal(null),
      suggestions: signal([]),
      loading: signal(false),
      error: signal(null),
      selectSuggestion: () => {},
      unselectSuggestion: () => {},
      upVoteSuggestion: () => {},
      addCommentToSuggestion: () => {},
      addReplyToComment: () => {},
    };

    const mockUsersFacade = {
      currentUser: signal({ id: 1, name: 'Test User', username: 'testuser', image: '' }),
    };

    await TestBed.configureTestingModule({
      imports: [SuggestionDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
        { provide: SuggestionsFacadeService, useValue: mockSuggestionsFacade },
        { provide: UsersFacade, useValue: mockUsersFacade },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
