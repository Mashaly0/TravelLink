import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../services/company.service';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { title } from 'process';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-booking',
  imports: [],
  templateUrl: './delete-booking.component.html',
  styleUrl: './delete-booking.component.scss'
})
export class DeleteBookingComponent {
  constructor(private service: CompanyService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteBookingComponent>, public matDialog: MatDialog) {
    this.itemName = this.data.itemName;
  }

  itemName!: string;

  toastService = inject(ToastrService);

  confirm() {
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,

    })
    this.service.deleteBooking(this.data.bookingId).subscribe(
      {
        next: (val) => {
          ref.close();
          this.toastService.success('Booking Deleted Successfully!', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });
          this.dialogRef.close(true);

        },
        error: (error) => {
          ref.close();
          let message = '';
          error['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        }
      }
    )
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
