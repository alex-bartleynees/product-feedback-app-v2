import { Directive, ElementRef, inject } from '@angular/core';
import { fromEvent, shareReplay, tap } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formGroup]',
  standalone: true,
})
export class FormSubmitDirective {
  private host = inject<ElementRef<HTMLFormElement>>(ElementRef);


  submit$ = fromEvent(this.element, 'submit').pipe(
    tap(() => {
      if (this.element.classList.contains('submitted') === false) {
        this.element.classList.add('submitted');
      }
    }),
    shareReplay(1)
  );

  get element() {
    return this.host.nativeElement;
  }
}
