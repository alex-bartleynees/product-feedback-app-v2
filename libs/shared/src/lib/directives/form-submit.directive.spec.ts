import { ElementRef } from '@angular/core';
import { FormSubmitDirective } from './form-submit.directive';

describe('FormSubmitDirective', () => {
  it('should create an instance', () => {
    const directive = new FormSubmitDirective(
      new ElementRef(document.createElement('form'))
    );
    expect(directive).toBeTruthy();
  });
});
