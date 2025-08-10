
import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import { TouristRegistration } from "../register-interfaces";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../auth-service.service";
import L from "leaflet";

@Component({
  selector: 'app-tourist-registration',
  templateUrl: './tourist-register.component.html',
  imports: [FormsModule,],
  styleUrls: ['./tourist-register.component.scss']
})
export class TouristRegisterComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const map = L.map('map').setView([0, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;


          map.setView([lat, lng], 13);
          const address = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.bc35f990c1e814b1b565b73a70a93e5d&lat=${lat}&lon=${lng}&format=json&accept-language=en`);

          const data = await address.json();

          this.model.address = data.place;

          // Add marker at current location
          L.marker([lat, lng])
            .addTo(map)
            .bindPopup('You are here.')
            .openPopup();
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location');
        }
      );
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

        const address = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.bc35f990c1e814b1b565b73a70a93e5d&lat=${lat}&lon=${lng}&format=json&accept-language=en`);

        const data = await address.json()

        let place = data.display_name;

        this.model.address = place;
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }

  service = inject(AuthService);

  model: TouristRegistration = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    preferences: '',
    favoriteDestinations: ''
  };

  onSubmit() {
    this.service.register(this.model, 'tourist')
  }
}