import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Review } from '../../Hotels/main-page/interfaces/review';
import { Destination } from '../interfaces/destination';
import { TourPackage } from '../interfaces/tour-package';
import { TourPackageService } from '../Services/tour-package.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared-app/Components/navbar/navbar.component';
import { AuthService } from '../../../../landing-app/Components/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../alert-dialog-component/alert-dialog-component';

@Component({
  selector: 'app-package-details',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.scss'
})
export class PackageDetailsComponent implements OnInit {
  [x: string]: any;
  package: TourPackage | null = null;
  reviews: Review[] = [];
  tops: any[] = [];
  errorMessage: string | null = null;
  router = inject(Router);

  dialog = inject(MatDialog);
  constructor(
    private route: ActivatedRoute,
    private tourPackageService: TourPackageService
  ) { }

  authService = inject(AuthService);

  goToLoginOrBook(packageId: string) {
    if (this.isLoggedIn()) {
      this.router.navigate(['/package-booking', packageId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    const packageId = this.route.snapshot.paramMap.get('packageId');
    if (packageId) {
      this.loadPackageDetails(packageId);
      this.loadReviews(packageId);
    } else {
      this.errorMessage = 'Invalid package ID.';
    }
  }

  loadPackageDetails(packageId: string): void {
    this.tourPackageService.getPackageById(packageId).subscribe({
      next: (pkg) => {
        this.package = pkg;
      },
      error: (err) => {
        console.error('Error fetching package details:', err.message);
        this.errorMessage = 'Failed to load package details.';
      }
    });
  }

  loadReviews(packageId: string): void {
    this.tourPackageService.getReviewsByPackageId(packageId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err.message);
        this.errorMessage = 'Failed to load reviews.';
      }
    });
  }

  getDestinationsString(destinations: Destination[]): string {
    return destinations.length > 0 ? destinations.map(d => d.name).join(', ') : 'None';
  }
}