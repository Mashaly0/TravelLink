import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HotelsService } from '../hotels-service.service';
import { Hotel } from '../interfaces/hotel-dashboard';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { last } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-hotel-profile',
  imports: [FormsModule, MatProgressSpinner],
  standalone: true,
  templateUrl: './manage-hotel-profile.component.html',
  styleUrl: './manage-hotel-profile.component.scss'
})
export class ManageHotelProfileComponent implements OnInit {
  service = inject(HotelsService);
  constructor(private route: ActivatedRoute, private matDialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { }

  photos: File[] = [];

  hotel!: Hotel;

  isHotelReqFinished = false;

  toastService = inject(ToastrService);

  ngOnInit(): void {
    this.service.profileDashBoard$.subscribe(
      {
        next: async (value) => {
          this.hotel = value;
          this.isHotelReqFinished = true;
          if (isPlatformBrowser(this.platformId) && this.isHotelReqFinished) {
            const L = await import('leaflet');

            L.Icon.Default.mergeOptions({
              iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            let oldAddress = await fetch(`https://us1.locationiq.com/v1/search?key=pk.bc35f990c1e814b1b565b73a70a93e5d&q=${this.hotel.address}&format=json&accept-language=en`);

            let oldAddressData = await oldAddress.json();

            const map = L.map('map').setView([oldAddressData[0].lat, oldAddressData[0].lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            L.marker([oldAddressData[0].lat, oldAddressData[0].lon]).addTo(map)
              .bindPopup(this.hotel.address || 'Hotel Location')
              .openPopup();

            let currentMarker: L.Marker | null = null;

            map.on('click', async (e: L.LeafletMouseEvent) => {
              const { lat, lng } = e.latlng;

              if (currentMarker) {
                map.removeLayer(currentMarker);
              }

              currentMarker = L.marker([lat, lng]).addTo(map)
                .bindPopup(`Selected Location:<br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`)
                .openPopup();

              console.log('Picked coordinates:', lat, lng);

              const address = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.bc35f990c1e814b1b565b73a70a93e5d&lat=${lat}&lon=${lng}&format=json`);

              const data = await address.json()

              let place = data.display_name;

              this.hotel.address = place;

              this.service.hotelDashBoardSubject.value.hotel!.address = this.hotel.address;
            });
          }
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
    this.service.getHotelProfile();
  }



  editProfile() {
    const formData = new FormData();
    formData.append('HotelName', this.hotel.hotelName);
    formData.append('Address', this.hotel.address);
    formData.append('Description', this.hotel.description);
    formData.append('ContactEmail', this.hotel.contactEmail);
    formData.append('ContactPhone', this.hotel.contactPhone);
    console.log(this.hotel.photoUrls);

    this.photos.map(
      (e) => {
        formData.append('Photos', e);
      }
    );
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    this.service.editProfile(formData, this.hotel.hotelID).subscribe({
      next: (value) => {
        ref.close();
        this.hotel = value;
        this.toastService.success('Profile Updated Successfully!', '✅ Success', {
          toastClass: 'ngx-toastr custom-success'
        });
        inject(Router).navigate(['/hotel/profile']);

      },
      error: (err) => {
        ref.close();
        let message = '';
        err['error']['errors'].map((e: string) => message += e + '\n');
        this.toastService.error(message, '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
      },
    });
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
