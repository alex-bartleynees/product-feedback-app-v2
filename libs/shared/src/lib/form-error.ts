import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';

@Component({
  template: `<p class="help is-danger" [class.hide]="_hide">{{ _text() }}</p>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  _text: WritableSignal<string | null> = signal('');
  _hide = signal(false);

  @Input() set text(value: string | null) {
    if (value !== this._text()) {
      this._text?.set(value);
      this._hide.set(!value);
    }
  }
}
