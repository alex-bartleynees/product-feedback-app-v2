import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionCommentComponent } from './suggestion-comment.component';

describe('SuggestionCommentComponent', () => {
  let component: SuggestionCommentComponent;
  let fixture: ComponentFixture<SuggestionCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggestionCommentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
