import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[controlErrorContainer]',
  standalone: true,
})
export class ControlErrorContainerDirective {
  constructor(public vcr: ViewContainerRef) {}
}
