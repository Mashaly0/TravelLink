import { Package } from './../interfaces/package';
import { Component, ElementRef, Inject, inject, OnChanges, OnInit, SimpleChanges, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { AuthService } from '../../landing-app/Components/auth-service.service';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
})
export class CompanyDashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute, public service: CompanyService, private matDialog: MatDialog) { }

  isBookingsReqFinished = false;
  isPackagesReqFinished = false;

  chartInstance: Chart | null = null;
  pieChartInstance: Chart | null = null;
  pendingCount = 0;
  confirmedCount = 0;
  cancelledCount = 0;

  authService = inject(AuthService);

  toastService = inject(ToastrService);

  ngOnInit(): void {
    this.service.packages$.subscribe(
      {
        next: (val) => {
          console.log(val);
          this.packages = val;
          this.numberOfPackages = this.packages.length;
          this.isPackagesReqFinished = true;
          this.drawChart()
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        }
      }
    );
    this.service.bookings$.subscribe(
      {
        next: (val) => {
          this.activeBookingsNumber = val.length;
          this.price = 0;
          val.map((booking) => {
            this.price += booking.totalPrice;
          });
          this.price = this.price * 9 / 10;
          this.isBookingsReqFinished = true;
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        }
      }
    );
    console.log(localStorage.getItem('email'));
    console.log(localStorage.getItem('id'));

    this.service.getCompanyPackages();
    this.service.getCompanyBookings();
  }

  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef;
  @ViewChild('pieChartCanvas', { static: true }) pieChartCanvas!: ElementRef;


  drawChart() {
    let packagesInJuly = [];
    let packagesInAugust = [];
    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;

    // Process packages for bar chart
    if (this.packages) {
      this.packages.map((e) => {
        let date = e.startDate.split('T')[0].split('-');
        if (date[1] == '07') {
          packagesInJuly.push(e);
        } else {
          packagesInAugust.push(e);
        }
      });
    }

    // Process bookings for pie chart
    if (this.service.bookingsSubject.value) {
      this.service.bookingsSubject.value.forEach((e) => {
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
            label: 'Packages',
            data: [packagesInJuly.length, packagesInAugust.length],
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

  name: string = "Aisha";

  packages!: Package[];

  activeBookingsNumber: number = 0;

  price: number = 0;

  numberOfPackages!: number;

  openDeleteDialog(packageId: string, itemName: string): void {
    this.matDialog.open(DeletePackageComponent, {
      data: { id: packageId, itemName: itemName }
    });
  }

  toFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }

  print(item: Package) {
    console.log(item.packageId);
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}