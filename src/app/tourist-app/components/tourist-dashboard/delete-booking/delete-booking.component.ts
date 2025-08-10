import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedAppModule } from '../../../../shared-app/shared-app.module';
import { TouristService } from '../../../tourist.service';
import { AlertDialogComponent } from '../../../../alert-dialog-component/alert-dialog-component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-booking',
  imports: [SharedAppModule],
  templateUrl: './delete-booking.component.html',
  styleUrl: './delete-booking.component.scss'
})
export class DeleteBookingComponent implements OnInit {

  constructor(private service: TouristService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteBookingComponent>, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.id = this.data.id;
    this.itemName = this.data.itemName;
  }
  id!: string;

  itemName!: string;
  confirm() {
    this.service.deleteBooking(this.id).subscribe(
      {
        next: (value) => {
          this.toastService.success('Booking deleted successfully!', '✅ Success', { toastClass: 'ngx-toastr custom-success' });
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', { toastClass: 'ngx-toastr custom-error' });
        },
      }
    );
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close(false);
  }
}