import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSubmitDirective } from './form-submit.directive';

@Component({
  template: `<form [formGroup]="form"></form>`,
  standalone: true,
  imports: [ReactiveFormsModule, FormSubmitDirective],
})
class TestHostComponent {
  form = new FormGroup({});
}

describe('FormSubmitDirective', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
