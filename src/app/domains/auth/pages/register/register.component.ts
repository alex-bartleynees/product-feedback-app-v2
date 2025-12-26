import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserForCreationDto } from '@product-feedback-app-v2/api-interfaces';
import { UsersService } from '@product-feedback-app-v2/core-data';
import {
  BackButtonComponent,
  ButtonComponent,
  ControlErrorsDirective,
  FormSubmitDirective,
  RegistrationForm,
} from '@product-feedback-app-v2/shared';

@Component({
  selector: 'product-feedback-app-v2-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    ReactiveFormsModule,
    BackButtonComponent,
    ButtonComponent,
    FormSubmitDirective,
    ControlErrorsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private router = inject(Router);
  private usersService = inject(UsersService);

  registrationForm = new RegistrationForm();
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.registrationForm.valid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const user: UserForCreationDto = {
      email: this.registrationForm.email.value,
      username: this.registrationForm.username.value,
      name: this.registrationForm.name.value,
      password: this.registrationForm.password.value,
      image: '',
    };

    this.usersService.createUser(user).subscribe({
      next: () => {
        window.location.href = '/bff/login';
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (error.status === 409) {
          this.errorMessage.set('A user with this email or username already exists.');
        } else {
          this.errorMessage.set('An error occurred. Please try again.');
        }
      },
    });
  }

  onLoginClick(event: Event): void {
    event.preventDefault();
    window.location.href = '/bff/login';
  }

  onCancelClick(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
