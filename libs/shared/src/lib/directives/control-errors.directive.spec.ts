import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlErrorsDirective } from './control-errors.directive';
import { FORM_ERRORS } from '../constants/form-errors';

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="test" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ControlErrorsDirective],
})
class TestHostComponent {
  form = new FormGroup({
    test: new FormControl(''),
  });
}

describe('ControlErrorsDirective', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: FORM_ERRORS,
          useValue: {},
        },
      ],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
