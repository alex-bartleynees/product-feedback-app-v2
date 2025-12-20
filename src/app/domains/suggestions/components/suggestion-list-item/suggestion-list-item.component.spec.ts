import { APP_CONFIG } from '@product-feedback-app-v2/app-config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionListItemComponent } from './suggestion-list-item.component';

describe('SuggestionListItemComponent', () => {
  let component: SuggestionListItemComponent;
  let fixture: ComponentFixture<SuggestionListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionListItemComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiEndpoint: 'http://test' } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
