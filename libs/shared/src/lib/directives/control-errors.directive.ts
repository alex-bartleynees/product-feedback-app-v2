/* eslint-disable @angular-eslint/directive-selector */
import {
  ComponentRef,
  Directive,
  Host,
  Inject,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subject, combineLatest, startWith, takeUntil } from 'rxjs';
import { FormSubmitDirective } from './form-submit.directive';
import { FormErrorComponent } from '../form-error';
import { FORM_ERRORS, FormErrors } from '../constants/form-errors';
import { ControlErrorContainerDirective } from './control-error-container.directive';

@Directive({
  selector: '[formControlName]',
  standalone: true,
})
export class ControlErrorsDirective implements OnInit {
  ref?: ComponentRef<FormErrorComponent>;
  submit$: Observable<Event>;
  container: ViewContainerRef;

  constructor(
    private vcr: ViewContainerRef,
    private control: NgControl,
    @Optional() controlErrorContainer: ControlErrorContainerDirective,
    @Optional() @Host() private form: FormSubmitDirective,
    @Inject(FORM_ERRORS) private errors: FormErrors
  ) {
    this.submit$ = this.form && this.form.submit$;
    this.container = controlErrorContainer ? controlErrorContainer.vcr : vcr;
  }

  private readonly destroy$ = new Subject();

  ngOnInit() {
    combineLatest([
      this.submit$,
      this.control.valueChanges?.pipe(startWith(null)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const controlErrors = this.control.errors;
        if (controlErrors && this.control.touched) {
          const firstKey = Object.keys(controlErrors)[0];
          const getError = this.errors[firstKey as keyof FormErrors];
          const text = getError(controlErrors[firstKey]);
          this.setError(text);
        } else if (this.ref) {
          this.setError(null);
        }
      });
  }

  setError(text: string | null) {
    if (!this.ref) {
      this.ref = this.container.createComponent(FormErrorComponent);
    }

    this.ref.instance.text = text;
  }
}
