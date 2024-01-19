import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

const formBuilder = new FormBuilder();
const getForm = () =>
  formBuilder.group({
    comment: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      },
    ],
  });

export class CommentForm extends FormGroup {
  constructor() {
    super(getForm().controls);
  }

  get comment(): AbstractControl {
    return this.get('comment') as AbstractControl;
  }
}
