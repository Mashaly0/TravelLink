import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourGuideBooking } from '../../../Hotels/main-page/interfaces/tour-guide-booking';
import { BookingService } from '../../../shared/booking.service';
import { TourGuide } from '../interfaces/tour-guide';
import { TourGuideService } from '../Services/tour-guide.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../../shared-app/Components/navbar/navbar.component';
import { StripeService } from '../../../../../payment/payment.service';
import { AuthService } from '../../../../../landing-app/Components/auth-service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tour-guide-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './tour-guide-booking.component.html',
  styleUrl: './tour-guide-booking.component.scss'
})
export class TourGuideBookingComponent implements OnInit {
  tourGuide: TourGuide | null = null;
  booking: TourGuideBooking = {
    touristEmail: '',
    tourGuideID: '',
    bookingDate: '',
    totalPrice: 0
  };
  availableDates: string[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  bookingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourGuideService: TourGuideService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      bookingDate: ['', Validators.required],
      numberOfHours: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const guideId = this.route.snapshot.queryParamMap.get('guideId');
    if (guideId) {
      this.booking.tourGuideID = guideId;
      this.loadTourGuideDetails(guideId);
      this.generateFutureDates();
    } else {
      this.errorMessage = 'Invalid tour guide ID.';
    }
  }

  loadTourGuideDetails(guideId: string): void {
    this.tourGuideService.getTourGuideById(guideId).subscribe({
      next: (guide) => {
        this.tourGuide = guide;
      },
      error: (err) => {
        this.errorMessage = `Error loading tour guide details: ${err.message}`;
      }
    });
  }

  generateFutureDates(): void {
    const today = new Date('2025-07-20T05:39:00+03:00'); // Current date and time in EEST
    this.availableDates = [];
    for (let i = 1; i <= 30; i++) { // Next 30 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.availableDates.push(date.toISOString());
    }
  }

  calculateTotalPrice(): number {
    return this.tourGuide ? this.tourGuide.pricePerHour * this.bookingForm.get('numberOfHours')?.value : 0;
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || !this.validateForm()) return;
    this.booking.touristEmail = localStorage.getItem('email')!;
    this.booking.bookingDate = this.bookingForm.get('bookingDate')?.value;
    this.booking.totalPrice = this.calculateTotalPrice();
    this.bookingService.createTourGuideBooking(this.booking).subscribe({
      next: (response) => {
        this.successMessage = 'Booking created successfully!';
        this.errorMessage = null;
        let price = this.booking.totalPrice;
        let bookingId = response.bookingID;
        this.router.navigate(['/create-checkout-session'], {
          state: {
            price,
            bookingId,
          }
        });
      },
      error: (err) => {
        this.errorMessage = `Booking failed: ${err.message}`;
        this.successMessage = null;
      }
    });
  }

  validateForm(): boolean {
    if (!this.bookingForm.get('bookingDate')?.value) {
      this.errorMessage = 'Please select a booking date.';
      return false;
    }
    if (this.bookingForm.get('numberOfHours')?.value < 1) {
      this.errorMessage = 'Number of hours must be at least 1.';
      return false;
    }
    if (!this.tourGuide || !this.tourGuide.isAvailable) {
      this.errorMessage = 'Selected tour guide is not available.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  goBack(): void {
    this.router.navigate(['/tour-guide-details', this.booking.tourGuideID]);
  }
}