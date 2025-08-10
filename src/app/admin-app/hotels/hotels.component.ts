import { Component, inject, OnInit } from '@angular/core';
import { Admin } from '../admin';
import { AdminService } from '../admin-service.service';
import { TourGuide } from '../../tour-guides-app/interfaces/tour-guide';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../hotels-app/interfaces/hotel-dashboard';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tour-guides',
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss'
})
export class AdminHotelsComponent implements OnInit {

  hotels!: Hotel[];

  dialog = inject(MatDialog);

  toastSerivce = inject(ToastrService);
  ngOnInit(): void {
    this.service.getAllHotels().subscribe(
      {
        next: (value) => {
          this.hotels = value;
        },
      }
    );
    this.service.getAllHotels();
  }

  service = inject(AdminService);


  verifyUser(userId: string) {
    let ref = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    })
    this.service.verifyUser(userId).subscribe({

      next: (value) => {
        ref.close();
        this.toastSerivce.success('User is verified!', '✅ Success', {
          toastClass: 'ngx-toastr custom-success'
        });
      },

      error: (err) => {
        ref.close();
        this.toastSerivce.error('Error verifying user!', '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
      },
    })
  }
}
