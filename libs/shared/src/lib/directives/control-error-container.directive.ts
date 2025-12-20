import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[controlErrorContainer]',
  standalone: true,
})
export class ControlErrorContainerDirective {
  vcr = inject(ViewContainerRef);
}
