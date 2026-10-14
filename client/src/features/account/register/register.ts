import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { TextInputs } from '../../../shared/text-inputs/text-inputs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInputs],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router =inject(Router)
  protected creds = {} as RegisterCreds;
  cancleRegister = output<boolean>();

  protected currentStep = signal(1);
 protected validationErrors = signal<string[]>([]);
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')
      ]]
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword']
        .updateValueAndValidity();
    });
  }

  matchValues(matchTo: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;

      if (!parent) {
        return null;
      }

      const matchValue = parent.get(matchTo)?.value;

      return control.value === matchValue
        ? null
        : { passwordMismatch: true };
    };
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(step => step + 1);
    } else {
      this.credentialsForm.markAllAsTouched();
    }
  }

  previousStep() {
    this.currentStep.update(step => Math.max(1, step - 1));
  }



  getMaxDate()
{
  const today= new Date();
  today.setFullYear(today.getFullYear()-18);
  return today.toISOString().split('T')[0];
}

 register() {
  if (!this.credentialsForm.valid || !this.profileForm.valid) {
    this.credentialsForm.markAllAsTouched();
    this.profileForm.markAllAsTouched();
    return;
  }

  const formData = {
    ...this.credentialsForm.value,
    ...this.profileForm.value
  };

  // confirmPassword is only for client-side validation.
  const { confirmPassword, ...registerData } = formData;

  this.accountService.register(registerData as RegisterCreds).subscribe({
    next: () => {
      this.router.navigateByUrl('/members');
    },
    error: error => {
      console.error('Registration failed:', error);
      this.validationErrors.set(
        Array.isArray(error) ? error : [error.message ?? 'Registration failed']
      );
    }
  });
}

  cancel() {
    this.cancleRegister.emit(false);
  }
}