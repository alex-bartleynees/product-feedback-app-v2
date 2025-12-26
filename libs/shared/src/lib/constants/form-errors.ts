import { InjectionToken } from '@angular/core';

export const defaultErrors = {
  required: () => "Can't be empty",
  minlength: ({
    requiredLength,
    actualLength,
  }: {
    requiredLength: number;
    actualLength: number;
  }) =>
    `Should be at least ${requiredLength} characters long (actual: ${actualLength})`,
  maxlength: ({
    requiredLength,
    actualLength,
  }: {
    requiredLength: number;
    actualLength: number;
  }) =>
    `Should be at most ${requiredLength} characters long (actual: ${actualLength})`,
  email: () => 'Please enter a valid email address',
  passwordMismatch: () => 'Passwords do not match',
} as const;

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});

export type FormErrors = typeof defaultErrors;
