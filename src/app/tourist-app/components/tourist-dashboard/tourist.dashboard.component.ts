import { DashBoard } from './../../../tour-guides-app/interfaces/dashboard';
import { ChartOptions, ChartType } from './../../../../../node_modules/chart.js/dist/types/index.d';
import { AuthService } from './../../../landing-app/Components/auth-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBookingComponent } from './delete-booking/delete-booking.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Booking, Tourist } from '../tourist';
import { TouristService } from '../../tourist.service';
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";
import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',

  standalone: true,
  imports: [CommonModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './tourist.dashboard.component.html',
  styleUrl: './tourist.dashboard.component.scss',

})
export class TouristDashboardComponent implements OnInit {
  chartInstance: Chart | null = null;
  pieChartInstance: Chart | null = null;
  logout() {
    this.authService.logout();
  }

  tourist!: Tourist;

  isTouristReq = false;

  filteredBookings!: Booking[];

  filteredStatus = '';

  price = 0;

  authService = inject(AuthService);

  toastService = inject(ToastrService);

  constructor(private matDialog: MatDialog, private service: TouristService, private el: ElementRef, private renderer: Renderer2) { }


  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef;
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas!: ElementRef;

  ngOnInit(): void {
    this.service.touristDashBoard$.subscribe(
      {
        next: (value) => {
          console.log('in here!');
          this.isTouristReq = true;
          this.tourist = value;
          this.filteredBookings = [];
          this.filteredStatus = 'Pending';
          this.tourist.bookings.map((e) => { this.price += e.totalPrice });
          this.filteredBookings = this.tourist.bookings.filter(
            (e) => e.status === this.filteredStatus
          );
          this.drawChart();
        },
        error: (err) => {
          this.toastService.error('Error getting Data,Try Again Later!', '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
    this.service.getTourist();
  }

  drawChart() {
    if (!this.tourist || !this.tourist.bookings) {
      console.warn('No tourist data available for charts');
      return;
    }

    let bookingsInJuly: Booking[] = [];
    let bookingsInAugust: Booking[] = [];
    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;

    this.tourist.bookings.forEach((e) => {
      let date = e.bookingDate.split('T')[0].split('-');
      if (date[1] === '07') {
        bookingsInJuly.push(e);
      } else if (date[1] === '08') {
        bookingsInAugust.push(e);
      }
      if (e.status === 'Pending') pendingCount++;
      else if (e.status === 'Confirmed') confirmedCount++;
      else if (e.status === 'Cancelled') cancelledCount++;
    });

    // Destroy existing charts
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
      this.pieChartInstance = null;
    }

    // Bar Chart
    if (this.barChartCanvas?.nativeElement) {
      this.renderer.setStyle(this.barChartCanvas.nativeElement, 'height', '250px');
      this.chartInstance = new Chart(this.barChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Jul', 'Aug'],
          datasets: [{
            label: 'Bookings',
            data: [bookingsInJuly.length, bookingsInAugust.length],
            backgroundColor: 'goldenrod',
            borderColor: '#000000', // Changed to black
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
                color: '#000000' // Changed to black
              }
            },
            x: {
              ticks: {
                color: '#000000' // Changed to black
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#000000' // Changed to black
              }
            },
            title: {
              display: true,
              text: 'Monthly Bookings',
              color: '#000000' // Changed to black
            }
          }
        }
      });
    }

    // Pie Chart
    if (this.pieChartCanvas?.nativeElement) {
      this.renderer.setStyle(this.pieChartCanvas.nativeElement, 'height', '250px');
      this.pieChartInstance = new Chart(this.pieChartCanvas.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Pending', 'Confirmed', 'Cancelled'],
          datasets: [{
            label: 'Booking Status',
            data: [pendingCount, confirmedCount, cancelledCount],
            backgroundColor: ['goldenrod', 'green', 'red'],
            borderColor: '#000000', // Changed to black
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
                color: '#000000' // Changed to black
              }
            },
            title: {
              display: true,
              text: 'Booking Status Distribution',
              color: '#000000' // Changed to black
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
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }
  }

  openDeleteDialog(id: string) {
    this.matDialog.open(DeleteBookingComponent, {
      data: { id: id }
    });
  }

  print(item: Booking) {
    console.log(item.bookingID)
  }

  filterBookings(status: string) {
    this.filteredStatus = status;
    this.filteredBookings = [];
    this.tourist.bookings.map((e) => {
      if (e.status == status) {
        this.filteredBookings.push(e);
      }
    });
    console.log(`list with ${status} is ${this.filteredBookings}`);

  }

  public barChartType: ChartType = 'bar';


  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Dashboard Overview' }
    }
  };
}
