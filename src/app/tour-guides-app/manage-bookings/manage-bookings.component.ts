import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { TourGuideService } from '../tour-guide.service';
import { Booking } from '../../tourism-company-app/interfaces/booking';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-bookings',
  imports: [RouterModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.scss',
  standalone: true,
})
export class ManageGuideBookingsComponent implements OnInit {


  tourGuideService = inject(TourGuideService);

  bookings: Booking[] = [];

  isBookingReqFinished = false;

  toastService = inject(ToastrService);


  constructor(private route: ActivatedRoute, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.tourGuideService.dashboard$.subscribe({
      next: (val) => {
        this.isBookingReqFinished = true;
        this.bookings = val.bookings!;
      },
      error: (err) => {
        let message = '';
        err['error']['errors'].map((e: string) => message += e + '\n');
        this.toastService.error(message, '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
      }
    });
    this.tourGuideService.getTourGuideDashBoard();
  }
}
