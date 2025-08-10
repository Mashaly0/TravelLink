import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelOffersService } from '../hotel-offers/hotel-offers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../landing-app/Components/auth-service.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { StripeService } from '../../../payment/payment.service';

@Component({
  selector: 'app-hotel-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  rooms: Room[] = [];
  loading = true;
  error: string | null = null;
  bookingRoom: Room | null = null;
  bookingInProgress = false;
  bookingSuccess: string | null = null;
  bookingError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelOffersService: HotelOffersService,
    private http: HttpClient,
    private authService: AuthService,
    private stripeService: StripeService,
    private router: Router,
  ) { }

  ngOnInit() {
    const hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (hotelId) {
      this.hotelOffersService.getHotels().subscribe({
        next: (hotels) => {
          this.hotel = hotels.find(h => h.hotelID === hotelId) || null;
          if (this.hotel) {
            this.hotelOffersService.getRooms().subscribe({
              next: (rooms) => {
                this.rooms = rooms.filter((r: Room) => r.hotelId === hotelId);
                this.loading = false;
              },
              error: () => {
                this.error = 'Failed to load rooms.';
                this.loading = false;
              }
            });
          } else {
            this.error = 'Hotel not found.';
            this.loading = false;
          }
        },
        error: () => {
          this.error = 'Failed to load hotel details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid hotel ID.';
      this.loading = false;
    }
  }

  startBooking(room: Room) {
    this.bookingRoom = room;
    this.bookingSuccess = null;
    this.bookingError = null;
  }

  submitBooking(form: { bookingDate: string }) {
    if (!this.hotel || !this.bookingRoom) return;
    const token = localStorage.getItem('token');
    if (!token) {
      this.bookingError = 'You must be logged in to book.';
      return;
    }
    this.bookingInProgress = true;
    const booking: CreateHotelBookingDto = {
      touristEmail: localStorage.getItem('email')!,
      hotelID: this.hotel.hotelID,
      roomID: this.bookingRoom.roomId,
      bookingDate: form.bookingDate,
      totalPrice: this.bookingRoom.pricePerNight
    };
    this.http.post('/api/Bookings/hotel', booking).subscribe({
      next: () => {
        this.bookingSuccess = 'Booking successful!';
        this.bookingInProgress = false;
        this.rooms = this.rooms.map(r =>
          r.roomId === this.bookingRoom!.roomId ? { ...r, isAvailable: false } : r
        );
        this.bookingRoom = null;
      },
      error: (err) => {
        this.bookingError = 'Booking failed. Please try again.';
        this.bookingInProgress = false;
      }
    });
  }

  cancelBooking() {
    this.bookingRoom = null;
    this.bookingSuccess = null;
    this.bookingError = null;
  }
}

export interface Hotel {
  hotelID: string;
  hotelName: string;
  address: string;
  description: string;
  rating: number;
  contactEmail: string;
  contactPhone: string;
  totalRooms: number;
  availableRooms: number;
  photoUrls: string[];
  price: number;
}

export interface Room {
  roomId: string;
  hotelId: string;
  roomType: string;
  pricePerNight: number;
  isAvailable: boolean;
  photoUrls: string[];
  hotelName?: string;
}

export interface CreateHotelBookingDto {
  touristEmail: string;
  hotelID: string;
  roomID: string;
  bookingDate: string;
  totalPrice: number;
}
