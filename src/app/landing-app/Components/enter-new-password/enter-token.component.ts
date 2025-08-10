import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPassword } from '../reset-password';
import { AuthService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { title } from 'process';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enter-new-password',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './enter-new-password.component.html',
  styleUrl: './enter-new-password.component.scss'
})
export class EnterNewPasswordComponent {
  resetForm!: FormGroup;
  passwordsDoNotMatch = false;
  router = inject(Router);
  email!: string;
  token!: string;
  resetPassword!: ResetPassword;
  service = inject(AuthService);
  dialog = inject(MatDialog);
  toastService = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    let nav = this.router.getCurrentNavigation();
    let state = nav?.extras.state as { email: string, token: string };
    this.email = state.email;
    this.token = state.token;
  }

  ngOnInit(): void {
    this.resetPassword = {
      password: '',
      confirmPassword: '',
      token: '',
      email: ''
    };
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.resetForm.valueChanges.subscribe(() => {
      this.passwordsDoNotMatch =
        this.resetForm.get('newPassword')?.value !== this.resetForm.get('confirmPassword')?.value;
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
    console.log(formData);

    this.resetPassword.password = formData.newPassword;
    this.resetPassword.confirmPassword = formData.confirmPassword;
    this.resetPassword.token = this.token;
    this.resetPassword.email = this.email;
    let ref = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    })
    this.service.sendNewPassword(this.resetPassword).subscribe(
      {
        next: (value) => {
          ref.close();
          this.toastService.success('Password is reset successfully!', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });

          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (err: { error: { errors: [] } }) => {
          ref.close();
          console.log('err ' + err.error.errors);
          let message = '';

          err.error.errors.map((e) => {
            message += e + '\n';
          });
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
  }
}
