import { Component, inject, OnInit } from '@angular/core';
import { HotelsService } from '../../hotels-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../interfaces/hotel-dashboard';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-manage-room',
  imports: [CommonModule, FormsModule, MatProgressSpinner],
  templateUrl: './manage-room.component.html',
  styleUrl: './manage-room.component.scss'
})
export class ManageRoomComponent implements OnInit {

  service = inject(HotelsService);

  constructor(private route: ActivatedRoute) { }

  room: Room = {
    roomId: '',
    roomType: '',
    pricePerNight: 0,
    photoUrls: [],
    isAvailable: false
  };
  id = '';

  router = inject(Router);

  photos: File[] = [];

  isRoomReqFinished = false;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (value) => {
        this.id = value['id'];
      },
    });
    this.service.hotelDashBoard$.subscribe(
      {
        next: (value) => {
          this.isRoomReqFinished = true;
          const foundRoom = value.rooms?.find(r => r.roomId === this.id);
          if (foundRoom) {
            this.room = foundRoom;
          }
          console.log('room is : ' + this.room);
          console.log(this.room.roomType);

        },
      }
    );
    this.service.getHotelDashBoard();
  }

  editRoom() {
    let formData = new FormData();
    formData.append('RoomType', this.room.roomType!.toString());
    formData.append('PricePerNight', this.room.pricePerNight!.toString());
    formData.append('IsAvailable', 'true');
    this.photos.map((e) => formData.append('Photos', e));
    this.service.editRoom(formData, this.room.roomId!);
  }

  addPhotosToForm(event: Event) {
    this.photos = [];
    const input = event.target as HTMLInputElement;
    if (input.files != null && input.files.length > 0) {
      for (let index = 0; index < input.files.length; index++) {
        this.photos.push(input.files[index]);
      }
    }
    console.log('number of photos : ' + this.photos.length);
  }
}
