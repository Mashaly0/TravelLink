import { Booking } from './../../../hotels-app/interfaces/hotel-dashboard';
import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";
import { TouristService } from '../../tourist.service';
import { Hotel, Room } from '../hotel-details/hotel-details.component';
import { TourGuide } from '../tour-guide-offers/tour-guide-offers.component';
import { Package } from '../../../tourism-company-app/interfaces/package';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';
import { CommonModule } from '@angular/common';
import { Trip } from '../trip';
import { HotelsService } from '../../../hotels-app/hotels-service.service';
import { title } from 'process';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-trip',
  imports: [NavbarComponent, FormsModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './new-trip.component.html',
  styleUrl: './new-trip.component.scss'
})
export class NewTripComponent {
  increaseNights() {
    this.numberOfNights++;
    if (this.selectedRoom) {
      this.totalPrice += Number(this.selectedRoom.pricePerNight);
    }
  }
  decreaseNights() {
    this.numberOfNights--;
    if (this.selectedRoom) {
      this.totalPrice -= Number(this.selectedRoom.pricePerNight);
    }
  }
  increaseGuideHours() {
    this.guideHours++;
    if (this.selectedTourGuide) {
      this.totalPrice += Number(this.selectedTourGuide.pricePerHour);
    }
  }
  decreaseGuideHours() {
    this.guideHours--;
    if (this.selectedTourGuide) {
      this.totalPrice -= Number(this.selectedTourGuide.pricePerHour);
    }
  }

  constructor() { }

  dialog = inject(MatDialog);

  service = inject(TouristService);

  trip!: Trip;

  searchTerm: string = '';

  selectedTourGuide: TourGuide | null = null;

  isPackageReqFinished: boolean = false;

  toastService = inject(ToastrService);

  currentStep = 0;

  numberOfNights = 1;
  guideHours = 1;

  selectedPackage: Package | null = null;

  selectedRoom: Room | null = null;

  totalPrice = 0;

  selectedDate: Date | null = null;

  router = inject(Router);

  booking: Booking = {
    touristEmail: '',
    hotelEmail: '',
    tourGuideEmail: '',
    bookingDate: '',
    packageId: '',
    roomId: '',
    totalPrice: 0,
    bookingID: '',
    tourGuideName: '',
    hotelName: '',
    roomType: '',
    packageName: '',
    status: ''
  };

  editPackageDate(event: Event) {
    this.selectedDate = (event.target as HTMLInputElement).valueAsDate;
  }
  packageSelected(item: Package, event: Event) {
    const target = (event.target as HTMLElement).closest('.destination-card') as HTMLElement;

    const isAlreadySelected = this.selectedPackage?.packageId === item.packageId;

    const cards = document.querySelectorAll('.tour-packages .destination-card');

    cards.forEach((card) => {
      (card as HTMLElement).style.backgroundColor = '';
    });

    if (isAlreadySelected) {
      this.selectedPackage = null;
      this.totalPrice -= Number(item.price);
      console.log('Card deselected:', item.packageName);
    } else {
      this.totalPrice += Number(item.price);
      this.selectedPackage = item;
      this.booking.packageId = item.packageId;
      target.style.backgroundColor = '#007dd1';
      console.log('Card selected:', item.packageName);
    }
  }
  roomSelected(item: Room, event: Event) {
    this.numberOfNights = 1;
    const target = (event.target as HTMLElement).closest('.room-card') as HTMLElement;

    const isAlreadySelected = this.selectedRoom?.roomId === item.roomId;

    const cards = document.querySelectorAll('.rooms .room-card');


    cards.forEach((card) => {
      (card as HTMLElement).style.backgroundColor = '';
    });

    if (isAlreadySelected) {
      this.selectedRoom = null;
      this.totalPrice -= Number(item.pricePerNight);
    } else {
      this.selectedRoom = item;
      this.totalPrice += Number(item.pricePerNight);
      this.booking.roomId = item.roomId;
      this.trip.hotelsRooms.map((e) => {
        e.map((room) => {
          if (room.roomId == item.roomId) {
            this.service.getHotelById(room.hotelId).subscribe(
              {
                next: (value) => {
                  this.booking.hotelEmail = value.contactEmail;
                },
                error: (err) => {
                  this.toastService.error('Error retrieveing hotels,try again later', '❌ Error', {
                    toastClass: 'ngx-toastr custom-error'
                  });
                },
              }
            )
          }
        });
      });
      target.style.backgroundColor = '#007dd1';
    }
  }
  guideSelected(item: TourGuide, event: Event) {
    const target = (event.target as HTMLElement).closest('.guide-card') as HTMLElement;

    const isAlreadySelected = this.selectedTourGuide?.guideID === item.guideID;

    const cards = document.querySelectorAll('.guides .guide-card');

    this.numberOfNights = 1;

    cards.forEach((card) => {
      (card as HTMLElement).style.backgroundColor = '';
    });

    if (isAlreadySelected) {
      this.selectedTourGuide = null;
      this.guideHours = 1;
      this.totalPrice -= Number(item.pricePerHour * this.guideHours);
    } else {
      this.totalPrice += Number(item.pricePerHour * this.guideHours);
      this.selectedTourGuide = item;
      this.booking.tourGuideEmail = item.contactEmail;
      target.style.backgroundColor = '#007dd1';
    }
  }

  getDestinationsForTrip() {
    if (this.searchTerm.length == 0) {
      this.toastService.error('Please enter a destination to search for.', '❌ Error', {
        toastClass: 'ngx-toastr custom-error'
      });
    }
    else {
      const ref = this.dialog.open(LoadingDialogComponent, {
        disableClose: true,
      });
      this.service.getDestinationsForTrip(this.searchTerm).subscribe(
        {
          next: (value) => {
            this.totalPrice = 0;
            this.numberOfNights = 1;
            this.guideHours = 1;
            this.selectedPackage = null;
            this.selectedRoom = null;
            this.selectedTourGuide = null;
            this.selectedDate = null;
            ref.close();
            console.log('value : ' + value.hotelsRooms);
            this.trip = value;
            console.log('value : ' + this.trip.hotelsRooms);
            this.isPackageReqFinished = true;
            this.currentStep = 0;
            this.skipToNext();
            console.log(this.trip.tourPackages);
          },
          error: (err) => {
            ref.close();
            this.toastService.error('Failed to fetch destinations. Please try again later.', '❌ Error', {
              toastClass: 'ngx-toastr custom-error'
            });
          }
        }
      );
    }
  }

  isPackageSelected() {
    return this.selectedPackage == null;
  }

  isRoomSelected() {
    return this.selectedRoom == null;
  }
  isGuideSelected() {
    return this.selectedTourGuide == null;
  }

  skipToNext() {
    ++this.currentStep;
    console.log(this.currentStep);

    const progressFill = document.querySelector('.progress-bar-custom .progress-fill') as HTMLElement;

    if (progressFill) {
      progressFill.style.width = `${this.currentStep * 25}%`;
      progressFill.style.backgroundColor = "#000";
    }

    console.log('total price : ' + this.totalPrice);
  }

  bookTrip() {
    this.booking.touristEmail = localStorage.getItem('email')!;
    this.booking.totalPrice = this.totalPrice;
    let date = new Date();
    if (this.selectedDate! <= date) {
      this.toastService.error('Please select a future date.', '❌ Error', {
        toastClass: 'ngx-toastr custom-error'
      });
    }
    else {
      this.booking.bookingDate = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const ref = this.dialog.open(LoadingDialogComponent, {
        disableClose: true,
      });
      let price = this.totalPrice;
      this.service.createBooking(this.booking).subscribe(
        {
          next: (value) => {
            this.totalPrice = 0;
            this.numberOfNights = 1;
            this.guideHours = 1;
            this.toastService.success('Booking created successfully.', '✅ Success', {
              toastClass: 'ngx-toastr custom-success'
            });
            ref.close();
            let bookingId = value.bookingID;
            this.router.navigate(['/create-checkout-session'], {
              state: {
                price,
                bookingId,
              }
            });
          },
          error: (err) => {
            ref.close();
            this.toastService.error('Failed to create booking. Please try again later.', '❌ Error', {
              toastClass: 'ngx-toastr custom-error'
            });
          },
        }
      );
    }
  }
}
