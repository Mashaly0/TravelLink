import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth-service.service';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  router = inject(Router);

  authService = inject(AuthService);
  email!: string;
  dialog = inject(MatDialog);

  toastService = inject(ToastrService);

  goToTokenPage() {
    console.log('this email' + this.email);

    let email = this.email;
    console.log('email' + email);
    const ref = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    })
    this.authService.sendResetEmail(this.email).subscribe(
      {
        next: (value) => {
          ref.close();
          this.toastService.success('Check Your Email For Sent Token', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });
          this.router.navigate(['/enter-sent-token'], {
            state: {
              email
            }
          });
        },
        error: (err) => {
          ref.close();
          this.toastService.error('Error Sending Email,Try Again Later!', '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
  }
}
