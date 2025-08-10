import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotelsServiceService } from '../../Services/hotels-service.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../../../shared-app/Components/navbar/navbar.component';
import { Room } from '../../interfaces/room';

@Component({
  selector: 'app-room-details',
  imports: [CommonModule, RouterModule,NavbarComponent],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss'
})
export class RoomDetailsComponent implements OnInit {
   room: Room | null = null;
  errorMessage: string | null = null;
  hotelId: string | null = null; // Store hotelId for navigation
  currentImageIndex: number = 0; // Track current image index for the room

  constructor(
    @Inject(HotelsServiceService) private hotelService: HotelsServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    this.hotelId = this.route.snapshot.queryParamMap.get('hotelId');
    if (roomId) {
      this.loadRoomDetails(roomId);
    } else {
      this.errorMessage = 'Invalid room ID.';
    }
  }

  loadRoomDetails(roomId: string): void {
    this.hotelService.getRoomById(roomId).subscribe({
      next: (room) => {
        console.log('Room details received in RoomDetailsComponent:', room);
        this.room = room;
      },
      error: (err) => {
        console.error('Error in RoomDetailsComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  goBack(): void {
    if (this.hotelId) {
      this.router.navigate(['/hotel-details', this.hotelId]);
    } else {
      this.router.navigate(['/hotel-reservation']);
    }
  }

  prevImage(): void {
    if (this.room && this.room.photoUrls && this.room.photoUrls.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.room.photoUrls.length) % this.room.photoUrls.length;
    }
  }

  nextImage(): void {
    if (this.room && this.room.photoUrls && this.room.photoUrls.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.room.photoUrls.length;
    }
  }
}