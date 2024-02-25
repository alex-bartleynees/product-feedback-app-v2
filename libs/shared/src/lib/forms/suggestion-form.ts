import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Suggestion } from '@product-feedback-app-v2/api-interfaces';

const formBuilder = new FormBuilder();
const getForm = () =>
  formBuilder.group({
    title: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      },
    ],
    category: [
      '',
      {
        validators: [Validators.required],
      },
    ],
    status: [''],
    description: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
        ],
      },
    ],
  });

export class SuggestionForm extends FormGroup {
  constructor(suggestion?: Suggestion | null) {
    super(getForm().controls);

    if (suggestion) {
      this.patchValue(suggestion);
    }
  }

  get title(): AbstractControl {
    return this.get('title') as AbstractControl;
  }

  get category(): AbstractControl {
    return this.get('category') as AbstractControl;
  }

  get statusControl(): AbstractControl {
    return this.get('status') as AbstractControl;
  }

  get description(): AbstractControl {
    return this.get('description') as AbstractControl;
  }
}
