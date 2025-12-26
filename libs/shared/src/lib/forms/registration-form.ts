import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

const formBuilder = new FormBuilder();

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  return null;
}

const getForm = () =>
  formBuilder.group(
    {
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      username: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        },
      ],
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        },
      ],
      password: [
        '',
        {
          validators: [Validators.required, Validators.minLength(8)],
        },
      ],
      confirmPassword: [
        '',
        {
          validators: [Validators.required],
        },
      ],
    },
    { validators: passwordMatchValidator },
  );

export class RegistrationForm extends FormGroup {
  constructor() {
    super(getForm().controls, { validators: passwordMatchValidator });
  }

  get email(): AbstractControl {
    return this.get('email') as AbstractControl;
  }

  get username(): AbstractControl {
    return this.get('username') as AbstractControl;
  }

  get name(): AbstractControl {
    return this.get('name') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.get('password') as AbstractControl;
  }

  get confirmPassword(): AbstractControl {
    return this.get('confirmPassword') as AbstractControl;
  }
}
