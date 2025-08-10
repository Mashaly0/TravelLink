import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyRegistration } from '../register-interfaces';
import { AuthService } from '../../auth-service.service';
import L from 'leaflet';

@Component({
  selector: 'app-company-register',
  imports: [FormsModule],
  templateUrl: './company-register.component.html',
  styleUrl: './company-register.component.scss'
})
export class CompanyRegisterComponent {

  map!: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([0, 0], 2);
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await this.getCurrentLocation();

          let currentMarker: L.Marker | null = null;


          this.map.on('click', async (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;

            if (currentMarker) {
              this.map.removeLayer(currentMarker);
            }

            currentMarker = L.marker([lat, lng]).addTo(this.map)
              .bindPopup(`Selected Location:<br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`)
              .openPopup();

            console.log('Picked coordinates:', lat, lng);

            const address = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.bc35f990c1e814b1b565b73a70a93e5d&lat=${lat}&lon=${lng}&format=json&accept-language=en`);

            const data = await address.json()

            let place = data.display_name;

            this.model.address = place;
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }
  service = inject(AuthService);
  model: CompanyRegistration = {
    address: '',
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    email: '',
    firstName: '',
    lastName: '',
    licenseNumber: '',
    password: '',
    phoneNumber: '',
  };
  async getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      this.map.setView([lat, lng], 13);
      const address = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.bc35f990c1e814b1b565b73a70a93e5d&lat=${lat}&lon=${lng}&format=json&accept-language=en`);

      const data = await address.json();

      this.model.address = data.place;

      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('You are here.')
        .openPopup();
    }, (error) => {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location');
    });
  }

  onSubmit() {
    this.service.register(this.model, 'tourismcompany')
  }
}
