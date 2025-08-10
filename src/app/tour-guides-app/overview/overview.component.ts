import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TourGuideService } from '../tour-guide.service';
import { DashBoard } from '../interfaces/dashboard';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../landing-app/Components/auth-service.service';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  logout() {
    this.authSerivce.logout();
  }
  dashBoard!: DashBoard;

  profit = 0;

  constructor(private matDialog: MatDialog) { }

  chartInstance: Chart | null = null;

  pieChartInstance: Chart | null = null;


  service = inject(TourGuideService);

  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef;

  authSerivce = inject(AuthService);

  @ViewChild('pieChartCanvas', { static: true }) pieChartCanvas!: ElementRef;

  toastService = inject(ToastrService);


  ngOnInit(): void {
    this.service.dashboard$.subscribe(
      {
        next: (value) => {
          this.dashBoard = value!;
          this.dashBoard.bookings?.map((e) => {
            this.profit += e.totalPrice;
          });
          this.profit = this.profit * 9 / 10;
          this.drawChart();
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
    this.service.getTourGuideDashBoard();
  }

  drawChart() {
    let bookingsInJuly = [];
    let bookingsInAugust = [];
    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;

    // Process packages for bar chart
    if (this.dashBoard.bookings) {
      this.dashBoard.bookings.map((e) => {
        let date = e.bookingDate.split('T')[0].split('-');
        if (date[1] == '07') {
          bookingsInJuly.push(e);
        } else {
          bookingsInAugust.push(e);
        }
      });
    }

    // Process bookings for pie chart
    if (this.service.dashboardSubject.value) {
      this.service.dashboardSubject.value.bookings!.forEach((e) => {
        if (e.status === 'Pending') pendingCount++;
        else if (e.status === 'Confirmed') confirmedCount++;
        else if (e.status === 'Cancelled') cancelledCount++;
      });
    }

    // Destroy existing charts
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
      this.pieChartInstance = null;
    }

    // Bar Chart for Packages
    if (this.barChartCanvas?.nativeElement) {
      this.chartInstance = new Chart(this.barChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Jul', 'Aug'],
          datasets: [{
            label: 'Bookings',
            data: [bookingsInJuly.length, bookingsInAugust.length],
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
    }

    if (this.pieChartCanvas?.nativeElement) {
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
    }
  }
  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
