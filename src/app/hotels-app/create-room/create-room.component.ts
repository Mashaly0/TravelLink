import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Room } from '../interfaces/hotel-dashboard';
import { HotelsService } from '../hotels-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-room',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss'
})
export class CreateRoomComponent implements OnInit {
  removeImage(index: number) {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
    if (this.photoPreviews.length === 0) {
      this.fileInput.nativeElement.value = '';
    }
  }

  constructor(private matDialog: MatDialog) { }

  room: Room = {
    isAvailable: true,
    roomType: '',
  };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  service = inject(HotelsService);

  router = inject(Router);

  toastService = inject(ToastrService);


  photos: File[] = [
  ];

  photoPreviews: string[] = [];

  ngOnInit(): void {
    this.room.isAvailable = true;
  }

  createNewRoom() {
    let formData = new FormData();
    formData.append('IsAvailable', this.room!.isAvailable!.toString());
    formData.append('PricePerNight', this.room!.pricePerNight!.toString());
    formData.append('RoomType', this.room!.roomType!.toString());
    this.photos.map((e) => {
      formData.append('Photos', e);
    });
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    this.service.addNewRoom(formData).subscribe(
      {

        next: (value) => {
          ref.close();
          this.room = value;
          this.toastService.success('Room Created Successfully!', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });
          this.router.navigate(['/hotel/dashboard']);
          this.photos = [];
        },
        error: (err) => {
          ref.close();
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
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

  addRoomImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files != null && input.files.length > 0) {
      for (let index = 0; index < input.files.length; index++) {
        this.photos.push(input.files[index]);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          this.photoPreviews.push(result);
        };
        reader.readAsDataURL(input.files[index]);
      }
    }
    console.log('number of photos : ' + this.photos.length);
  }
}
