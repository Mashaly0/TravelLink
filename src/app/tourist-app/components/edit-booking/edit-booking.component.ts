import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Booking } from '../tourist';
import { TouristService } from '../../tourist.service';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { TouristNavbarComponent } from '../tourist-navbar/tourist-navbar.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";
import { title } from 'process';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-booking',
  imports: [MatProgressSpinner, FormsModule, CommonModule, RouterModule],
  providers: [TouristNavbarComponent],
  templateUrl: './edit-booking.component.html',
  styleUrl: './edit-booking.component.scss'
})
export class EditBookingComponent implements OnInit {

  id!: string;

  isBookingReqFinished = false;

  isEditing = true;

  booking!: Booking;

  service = inject(TouristService);

  toastService = inject(ToastrService);

  constructor(private route: ActivatedRoute, private matDialog: MatDialog) { }

  router = inject(Router);
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      console.log('Booking ID from paramMap:', this.id);

      if (this.id) {
        this.service.getBooking(this.id).subscribe({
          next: (value) => {
            this.isBookingReqFinished = true;
            this.booking = value;
            let date = new Date(this.booking.bookingDate).toISOString().substring(0, 10);
            console.log('date : ' + date);
          },
          error: (err) => {
            let message = '';
            err['error']['errors'].map((e: string) => message += e + '\n');
            this.toastService.error(message, '❌ Error', {
              toastClass: 'ngx-toastr custom-error'
            });

          },
        });
      }
    });
  }


  saveData() {
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });

    this.service.editBooking(this.booking).subscribe({
      next: (value) => {
        ref.close();
        this.booking = value;
        this.isEditing = false;
        this.toastService.success('Booking Edited Succcessfully!', '✅ Success', {
          toastClass: 'ngx-toastr custom-success'
        });
        this.router.navigate(['/tourist/dashboard'], { replaceUrl: true });
      },
      error: (err: string) => {
        ref.close();
        console.log(err);
        this.toastService.error('Error while creating Booking,try again later!', '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
        this.router.navigate(['/tourist/dashboard'], { replaceUrl: true });

      },
    });
  }


  get BookingDate(): string {
    let date: Date = new Date(this.booking.bookingDate);
    return date.toISOString().substring(0, 10);
  }

  set BookingDate(date: string) {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    this.booking.bookingDate = d.toISOString();
  }
}
