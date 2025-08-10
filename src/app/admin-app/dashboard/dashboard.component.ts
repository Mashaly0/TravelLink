import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../landing-app/Components/auth-service.service';
import { Admin } from '../admin';
import { AdminService } from '../admin-service.service';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Hotel } from '../../hotels-app/interfaces/hotel-dashboard';
import { TourGuide } from '../../tour-guides-app/interfaces/tour-guide';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [MatProgressSpinner, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // Destroy existing charts
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
      this.pieChartInstance = null;
    }
  }

  chartInstance: Chart | null = null;
  pieChartInstance: Chart | null = null;
  hotelsChartInstance: Chart | null = null;


  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef;
  @ViewChild('pieChartCanvas', { static: true }) pieChartCanvas!: ElementRef;
  @ViewChild('hotelsChartCanvas', { static: true }) hotelsChartCanvas!: ElementRef;

  isAdminReqFinished = false;

  isAllHotelsReqFinished = false;
  isAllGuidesReqFinished = false;

  hotels!: Hotel[];

  tourGuides!: TourGuide[];

  totalTourists = 0;
  totalGuides = 0;
  totalHotels = 0;
  totalCompanies = 0;
  totalPackages = 0;
  toastService = inject(ToastrService);



  ngOnInit(): void {

    this.adminService.getAdminDashboard().subscribe(
      {
        next: (value) => {
          value.topTourGuides = value.topTourGuides.sort((a, b) => b.averageRating! - a.averageRating!).slice(0, 3);
          value.topHotels = value.topHotels.sort((a, b) => b.rating! - a.rating!).slice(0, 3);
          value.topTourPackages = value.topTourPackages.sort((a, b) => b.price! - a.price!).slice(0, 3);
          this.admin = value;
          this.isAdminReqFinished = true;
          this.drawChart();
        },
        error: (err) => {
          this.toastService.error('Error Getting data try again later', '❌ Error', { toastClass: 'ngx-toastr custom-error' });
        },
      }
    );
    this.adminService.getAllHotels().subscribe(
      {
        next: (value) => {
          this.isAllHotelsReqFinished = true;
          this.hotels = value;
          this.totalHotels = this.hotels.length;
          this.drawChart();
        },
        error: (err) => {
          this.toastService.error('Error Getting Hotels try again later', '❌ Error', { toastClass: 'ngx-toastr custom-error' });
        },
      }
    );
    this.adminService.getAllGuides().subscribe(
      {
        next: (value) => {
          this.isAllGuidesReqFinished = true;
          this.tourGuides = value;
          this.totalGuides = this.tourGuides.length;
          this.drawChart();

        },
        error: (err) => {
          this.toastService.error('Error Getting Guides try again later', '❌ Error', { toastClass: 'ngx-toastr custom-error' });
        },
      }
    );
    this.adminService.getAllPackages().subscribe(
      {
        next: (value) => {
          this.isAllGuidesReqFinished = true;
          this.totalPackages = value.length;
          this.drawChart();
        },
        error: (err) => {
          this.toastService.error('Error Getting Packages try again later', '❌ Error', { toastClass: 'ngx-toastr custom-error' });
        },
      }
    );
    this.adminService.getAdminDashboard();
    this.adminService.getAllGuides();
    this.adminService.getAllHotels();
    this.adminService.getAllPackages();
  }

  verifyUser(userId: string) {
    let ref = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    })
    this.adminService.verifyUser(userId).subscribe({
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

  authService = inject(AuthService);

  adminService = inject(AdminService);

  admin!: Admin;

  dialog = inject(MatDialog);

  logout() {
    this.authService.logout();
  }

  drawChart() {
    let reviewsInJuly = [];
    let reviewsInAugust = [];
    let moreThanFourStarsHotels = [];
    let fourStarsHotels = [];
    let lessThanFourStarsHotels = [];
    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;

    // Process packages for bar chart
    if (this.admin.recentReviews) {
      this.admin.recentReviews.map((e) => {
        let date = e.reviewDate.split('T')[0].split('-');
        if (date[1] == '07') {
          reviewsInJuly.push(e);
        } else {
          reviewsInAugust.push(e);
        }
      });
    }

    // Process bookings for pie chart
    if (this.admin.recentBookings) {
      this.admin.recentBookings.forEach((e) => {
        if (e.status === 'Pending') pendingCount++;
        else if (e.status === 'Confirmed') confirmedCount++;
        else if (e.status === 'Cancelled') cancelledCount++;
      });
    }
    if (this.admin.topHotels) {
      this.admin.topHotels.forEach((e) => {
        if (e.rating > 4) moreThanFourStarsHotels.push(e);
        else if (e.rating === 4) fourStarsHotels.push(e);
        else if (e.rating < 4) lessThanFourStarsHotels.push(e);
      });
    }

    this.chartInstance = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jul', 'Aug'],
        datasets: [{
          label: 'Reviews',
          data: [reviewsInJuly.length, reviewsInAugust.length],
          backgroundColor: 'goldenrod',
          borderColor: '#000000',
          borderWidth: 1,
          barThickness: 30,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 3,
              color: '#000000'
            }
          },
          x: {
            ticks: {
              color: '#000000'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#000000'
            }
          },
          title: {
            display: true,
            text: 'Monthly Packages',
            color: '#000000'
          }
        }
      }
    });


    // Pie Chart for Bookings
    this.pieChartInstance = new Chart(this.pieChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Confirmed', 'Cancelled'],
        datasets: [{
          label: 'Booking Status',
          data: [pendingCount, confirmedCount, cancelledCount],
          backgroundColor: ['goldenrod', 'green', 'red'],
          borderColor: '#000000',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#000000'
            }
          },
          title: {
            display: true,
            text: 'Booking Status Distribution',
            color: '#000000'
          }
        }
      }
    });
    this.hotelsChartInstance = new Chart(this.hotelsChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['More Than 4 Stars', '4 Stars', 'More Than 4 Stars'],
        datasets: [{
          label: 'Hotels Rating',
          data: [moreThanFourStarsHotels.length, fourStarsHotels.length, lessThanFourStarsHotels.length],
          backgroundColor: ['goldenrod', 'green', 'red'],
          borderColor: '#000000',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#000000'
            }
          },
          title: {
            display: true,
            text: 'Hotels Rating Distribution',
            color: '#000000'
          }
        }
      }
    });

  }
}
