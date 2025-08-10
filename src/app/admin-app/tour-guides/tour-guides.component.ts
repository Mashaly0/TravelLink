import { Component, inject, OnInit } from '@angular/core';
import { Admin } from '../admin';
import { AdminService } from '../admin-service.service';
import { TourGuide } from '../../tour-guides-app/interfaces/tour-guide';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tour-guides',
  imports: [CommonModule, RouterLink],
  templateUrl: './tour-guides.component.html',
  styleUrl: './tour-guides.component.scss'
})
export class AdminTourGuidesComponent implements OnInit {

  tourGuides!: TourGuide[];

  dialog = inject(MatDialog);
  ngOnInit(): void {
    this.service.getAllGuides().subscribe(
      {
        next: (value) => {
          this.tourGuides = value;
        },
      }
    );
    this.service.getAllGuides();
  }
  admin!: Admin;

  service = inject(AdminService);

  toastService = inject(ToastrService);


  verifyUser(userId: string) {
    let ref = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    })
    this.service.verifyUser(userId).subscribe({
      next: (value) => {
        ref.close();
        this.toastService.success('User is verified!', '✅ Success', {
          toastClass: 'ngx-toastr custom-success'
        });
      },

      error: (err) => {
        ref.close();
        this.toastService.error('Error verifying user!', '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
      },
    })
  }
}
