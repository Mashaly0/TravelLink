import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { HotelsService } from '../hotels-service.service';
import { Booking, HotelDashBoard } from '../interfaces/hotel-dashboard';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../../landing-app/Components/auth-service.service';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);
@Component({
  selector: 'app-hotel-dashboard',
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './hotel-dashboard.component.html',
  styleUrl: './hotel-dashboard.component.scss'
})
export class HotelDashboardComponent implements OnInit {

  constructor(private matDialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { }

  authService = inject(AuthService);

  chartInstance: Chart | null = null;
  pieChartInstance: Chart | null = null;


  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef;
  @ViewChild('pieChartCanvas', { static: true }) pieChartCanvas!: ElementRef;

  service = inject(HotelsService);

  isHotelReqFinished = false;

  private map: L.Map | undefined;

  hotelDashBoard!: HotelDashBoard;

  toastService = inject(ToastrService);

  profit = 0;

  filteredStatus = '';

  filteredBookings: Booking[] = [];

  filterBookings(status: string) {
    this.filteredStatus = status;
    this.filteredBookings = [];
    this.hotelDashBoard.bookings!.map((e) => {
      if (e.status == status) {
        this.filteredBookings.push(e);
      }
    });
    console.log(`list with ${status} is ${this.filteredBookings}`);

  }


  ngOnInit() {
    this.service.hotelDashBoard$.subscribe(
      {
        next: async (value) => {
          this.hotelDashBoard = value;
          this.isHotelReqFinished = true;
          value.bookings?.map((e) => {
            this.profit += e.totalPrice;
            console.log('this.profit + ' + this.profit);
          });
          this.drawChart();
          console.log('profit' + this.profit);
          this.filteredStatus = 'Pending';
          this.filteredBookings = this.hotelDashBoard.bookings!.filter(
            (e) => e.status === this.filteredStatus
          );

          this.profit = this.profit * 9 / 10;
          if (isPlatformBrowser(this.platformId)) {
            const L = await import('leaflet');

            try {
              const res = await fetch(`https://us1.locationiq.com/v1/search?key=pk.bc35f990c1e814b1b565b73a70a93e5d&q=${this.hotelDashBoard.hotel?.address}&format=json&accept-language=en`);
              const data = await res.json();
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);

              const map = L.map('map').setView([lat, lon], 13);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              }).addTo(map);

              L.marker([lat, lon]).addTo(map)
                .bindPopup(this.hotelDashBoard.hotel?.address || 'Hotel Location')
                .openPopup();

            } catch (error) {
              console.error("Failed to initialize map:", error);
            }
          }

        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: message
            }
          });
        },
      }
    );
    this.service.getHotelDashBoard();
  }

  drawChart() {
    let reviewsInJuly = [];
    let reviewsInAugust = [];
    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;

    // Process packages for bar chart
    if (this.hotelDashBoard.reviews) {
      this.hotelDashBoard.reviews.map((e) => {
        let date = e.reviewDate.split('T')[0].split('-');
        if (date[1] == '07') {
          reviewsInJuly.push(e);
        } else {
          reviewsInAugust.push(e);
        }
      });
    }

    // Process bookings for pie chart
    if (this.hotelDashBoard?.bookings) {
      this.hotelDashBoard.bookings.forEach((e) => {
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
    }

    // Pie Chart for Bookings
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

  logout() {
    this.authService.logout();
  }
}
