import { AuthService } from './../../../../../../landing-app/Components/auth-service.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelsServiceService } from '../../Services/hotels-service.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../../../shared-app/Components/navbar/navbar.component";
import { Hotel } from '../../interfaces/hotel';
import { Room } from '../../interfaces/room';
import { Review } from '../../interfaces/review';
import { ReviewService } from '../../Services/review.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../../../../alert-dialog-component/alert-dialog-component';

@Component({
  selector: 'app-hotels-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './hotels-details.component.html',
  styleUrls: ['./hotels-details.component.scss']
})
export class HotelsDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  rooms: Room[] = [];
  errorMessage: string | null = null;
  currentHotelImageIndex: number = 0;
  currentRoomImageIndices: number[] = [];
  reviews: Review[] = [];
  dialog = inject(MatDialog);

  authService = inject(AuthService);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor(
    @Inject(HotelsServiceService) private hotelService: HotelsServiceService,
    @Inject(ReviewService) private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (hotelId) {
      this.loadHotelDetails(hotelId);
      this.loadHotelRooms(hotelId);
      this.loadReviews(hotelId);
    } else {
      this.errorMessage = 'Invalid hotel ID.';
    }
  }

  loadHotelRooms(hotelId: string): void {
    this.hotelService.getHotelRooms(hotelId).subscribe({
      next: (rooms) => {
        console.log('Rooms received in HotelsDetailsComponent:', rooms);
        this.rooms = rooms;
        this.currentRoomImageIndices = new Array(rooms.length).fill(0);
      },
      error: (err) => {
        console.error('Error in HotelsDetailsComponent (Rooms):', err.message);
        this.errorMessage = this.errorMessage ? `${this.errorMessage} | Rooms Error: ${err.message}` : `Rooms Error: ${err.message}`;
      }
    });
  }

  loadHotelDetails(hotelId: string): void {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        console.log('Hotel details received in HotelsDetailsComponent:', hotel);
        this.hotel = hotel;
      },
      error: (err) => {
        console.error('Error in HotelsDetailsComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  loadReviews(hotelId: string): void {
    this.reviewService.getReviewsByHotelId(hotelId).subscribe({
      next: (reviews) => {
        console.log('Reviews received in HotelsDetailsComponent:', reviews);
        this.reviews = reviews;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  getAverageRoomPrice(): string {
    if (this.rooms.length === 0) return 'N/A';
    const totalPrice = this.rooms.reduce((sum, room) => sum + room.pricePerNight, 0);
    const averagePrice = totalPrice / this.rooms.length;
    return averagePrice.toFixed(2);
  }

  extractCity(address: string): string {
    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : 'Unknown';
  }

  getStarRatingArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarRatingArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  goBack(): void {
    this.router.navigate(['/hotel-reservation']);
  }

  viewRoom(roomId: string): void {
    this.router.navigate(['/room-details', roomId], { queryParams: { hotelId: this.route.snapshot.paramMap.get('hotelId') } });
  }

  prevHotelImage(): void {
    if (this.hotel && this.hotel.photoUrls && this.hotel.photoUrls.length > 0) {
      this.currentHotelImageIndex = (this.currentHotelImageIndex - 1 + this.hotel.photoUrls.length) % this.hotel.photoUrls.length;
    }
  }

  nextHotelImage(): void {
    if (this.hotel && this.hotel.photoUrls && this.hotel.photoUrls.length > 0) {
      this.currentHotelImageIndex = (this.currentHotelImageIndex + 1) % this.hotel.photoUrls.length;
    }
  }
  bookRoom(hotelId: string, roomId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/hotel-booking'], { queryParams: { hotelId, roomId } });

    } else {
      this.router.navigate(['/login']);
    }
  }

  prevRoomImage(index: number): void {
    if (this.rooms[index].photoUrls && this.rooms[index].photoUrls.length > 0) {
      this.currentRoomImageIndices[index] = (this.currentRoomImageIndices[index] - 1 + this.rooms[index].photoUrls.length) % this.rooms[index].photoUrls.length;
    }
  }

  nextRoomImage(index: number): void {
    if (this.rooms[index].photoUrls && this.rooms[index].photoUrls.length > 0) {
      this.currentRoomImageIndices[index] = (this.currentRoomImageIndices[index] + 1) % this.rooms[index].photoUrls.length;
    }
  }
}