import { MatDialog } from '@angular/material/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin-service.service';
import { Booking } from '../../hotels-app/interfaces/hotel-dashboard';
import { Admin } from '../admin';
import { DeleteBookingComponent } from '../../tourism-company-app/manage-bookings/delete-booking/delete-booking.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule, RouterLink],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class AdminBookingsComponent implements OnInit {

  service = inject(AdminService);

  admin!: Admin;

  matDialog = inject(MatDialog);

  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  filteredStatus = '';
  ngOnInit(): void {
    this.service.getAdminDashboard().subscribe(
      {
        next: (value) => {
          this.admin = value;
          this.bookings = value.recentBookings;
          this.filteredBookings = [];
          this.filteredStatus = 'Pending';
          this.filteredBookings = value.recentBookings.filter(
            (e) => e.status === this.filteredStatus
          );
        },
      }
    )
    this.service.getAdminDashboard();
  }

  filterBookings(status: string) {
    this.filteredStatus = status;
    this.filteredBookings = [];
    this.admin.recentBookings.map((e) => {
      if (e.status == status) {
        this.filteredBookings.push(e);
      }
    });
    console.log(`list with ${status} is ${this.filteredBookings}`);

  }

  openDeleteDialog(id: string) {
    this.matDialog.open(DeleteBookingComponent, {
      data: { id: id }
    });
  }
}
