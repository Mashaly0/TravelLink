import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../../shared/booking.service';
import { Hotel } from '../../interfaces/hotel';
import { HotelBooking } from '../../interfaces/hotel-booking';
import { Room } from '../../interfaces/room';
import { HotelsServiceService } from '../../Services/hotels-service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../../../../../shared-app/Components/navbar/navbar.component';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './hotel-booking.component.html',
  styleUrl: './hotel-booking.component.scss'
})
export class HotelBookingComponent implements OnInit {
  hotel: Hotel | null = null;
  room: Room | null = null;
  booking: HotelBooking = {
    touristEmail: '',
    hotelID: '',
    roomID: '',
    bookingDate: '',
    totalPrice: 0
  };
  numberOfNights: number = 1;
  availableDates: string[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  bookingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelsServiceService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      bookingDate: ['', Validators.required],
      numberOfNights: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const hotelId = this.route.snapshot.queryParamMap.get('hotelId');
    const roomId = this.route.snapshot.queryParamMap.get('roomId');
    if (hotelId && roomId) {
      this.booking.hotelID = hotelId;
      this.booking.roomID = roomId;
      this.loadHotelDetails(hotelId);
      this.loadRoomDetails(hotelId, roomId);
      this.generateFutureDates();
    } else {
      this.errorMessage = 'Invalid hotel or room ID.';
    }
  }

  loadHotelDetails(hotelId: string): void {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        this.hotel = hotel;
      },
      error: (err) => {
        this.errorMessage = `Error loading hotel details: ${err.message}`;
      }
    });
  }

  loadRoomDetails(hotelId: string, roomId: string): void {
    this.hotelService.getHotelRooms(hotelId).subscribe({
      next: (rooms) => {
        this.room = rooms.find(r => r.roomId === roomId) || null;
        if (!this.room) {
          this.errorMessage = 'Room not found.';
        }
      },
      error: (err) => {
        this.errorMessage = `Error loading room details: ${err.message}`;
      }
    });
  }

  generateFutureDates(): void {
    const today = new Date('2025-07-20'); // Current date
    this.availableDates = [];
    for (let i = 1; i <= 30; i++) { // Next 30 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.availableDates.push(date.toISOString());
    }
  }

  calculateTotalPrice(): number {
    return this.room ? this.room.pricePerNight * this.bookingForm.get('numberOfNights')?.value : 0;
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || !this.validateForm()) return;
    this.booking.touristEmail = localStorage.getItem('email')!;
    this.booking.bookingDate = this.bookingForm.get('bookingDate')?.value;
    this.booking.totalPrice = this.calculateTotalPrice();
    this.bookingService.createHotelBooking(this.booking).subscribe({
      next: (response) => {
        console.log(response);
        this.successMessage = 'Booking created successfully!';
        this.errorMessage = null;
        let price = this.calculateTotalPrice();
        let bookingId = response.bookingID;
        console.log('price : ' + price);
        this.router.navigate(['/create-checkout-session'], {
          state: {
            price,
            bookingId,
          }
        });
      },
      error: (err) => {
        this.errorMessage = `Booking failed: ${err}`;
        this.successMessage = null;
      }
    });
  }

  validateForm(): boolean {
    if (!this.bookingForm.get('bookingDate')?.value) {
      this.errorMessage = 'Please select a booking date.';
      return false;
    }
    if (this.bookingForm.get('numberOfNights')?.value < 1) {
      this.errorMessage = 'Number of nights must be at least 1.';
      return false;
    }
    if (!this.room || !this.room.isAvailable) {
      this.errorMessage = 'Selected room is not available.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  goBack(): void {
    this.router.navigate(['/hotels-details', this.booking.hotelID]);
  }
}