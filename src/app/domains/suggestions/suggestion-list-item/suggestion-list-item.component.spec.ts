import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionListItemComponent } from './suggestion-list-item.component';

describe('SuggestionListItemComponent', () => {
  let component: SuggestionListItemComponent;
  let fixture: ComponentFixture<SuggestionListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggestionListItemComponent],
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
