import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPassword } from '../reset-password';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-sent-token-password',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './enter-sent-token.component.html',
  styleUrl: './enter-sent-token.component.scss'
})
export class EnterSentTokenComponent {
  resetForm!: FormGroup;
  passwordsDoNotMatch = false;
  router = inject(Router);
  email!: string;
  authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    let nav = this.router.getCurrentNavigation();
    let state = nav?.extras.state as { email: string };
    this.email = state.email
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      sentToken: ['', [Validators.required,]],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.resetForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.resetForm.invalid || this.passwordsDoNotMatch) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const formData = this.resetForm.value;
    let email = this.email;
    let token = formData.sentToken;
    this.router.navigate(['/enter-new-password'], {
      state: {
        email,
        token,
      }
    });
  }
}
