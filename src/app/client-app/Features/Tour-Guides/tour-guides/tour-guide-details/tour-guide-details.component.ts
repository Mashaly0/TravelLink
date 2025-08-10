import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TourGuide } from '../interfaces/tour-guide';
import { TourGuideService } from '../Services/tour-guide.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../../shared-app/Components/navbar/navbar.component';
import { Review } from '../../../Hotels/main-page/interfaces/review';
import { ReviewService } from '../../../Hotels/main-page/Services/review.service';
import { AuthService } from '../../../../../landing-app/Components/auth-service.service';
import { AlertDialogComponent } from '../../../../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tour-guide-details',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './tour-guide-details.component.html',
  styleUrl: './tour-guide-details.component.scss'
})
export class TourGuideDetailsComponent implements OnInit {
  tourGuide: TourGuide | null = null;
  reviews: Review[] = [];

  authService = inject(AuthService);


  goToLoginOrBook(packageId: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/package-booking', packageId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  errorMessage: string | null = null;
  dialog = inject(MatDialog);
  currentImageIndex: number = 0; // Track current image index for the slider

  constructor(
    @Inject(TourGuideService) private tourGuideService: TourGuideService,
    @Inject(ReviewService) private reviewService: ReviewService,

    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const guideId = this.route.snapshot.paramMap.get('guideId');
    if (guideId) {
      this.loadTourGuideDetails(guideId);
      this.loadReviews(guideId);

    } else {
      this.errorMessage = 'Invalid tour guide ID.';
    }
  }
  bookTourGuide(guideId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tourguide-booking'], { queryParams: { guideId } });
    } else {
      this.router.navigate(['/login']);
    }
  }
  loadTourGuideDetails(guideId: string): void {
    this.tourGuideService.getTourGuideById(guideId).subscribe({
      next: (guide) => {
        console.log('Tour guide details received in TourGuideDetailsComponent:', guide);
        this.tourGuide = guide;
      },
      error: (err) => {
        console.error('Error in TourGuideDetailsComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }
  loadReviews(guideId: string): void {
    this.reviewService.getReviewsByGuideId(guideId).subscribe({
      next: (reviews) => {
        console.log('Reviews received in TourGuideDetailsComponent:', reviews);
        this.reviews = reviews;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err.message);
        this.errorMessage = err.message;
      }
    });
  }
  getStarRatingArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarRatingArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  goBack(): void {
    this.router.navigate(['/tour-guides']);
  }

  prevImage(): void {
    if (this.tourGuide && this.tourGuide.photoUrls && this.tourGuide.photoUrls.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.tourGuide.photoUrls.length) % this.tourGuide.photoUrls.length;
    }
  }

  nextImage(): void {
    if (this.tourGuide && this.tourGuide.photoUrls && this.tourGuide.photoUrls.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.tourGuide.photoUrls.length;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }
}