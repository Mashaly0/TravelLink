import { Component, OnInit } from '@angular/core';
import { HotelOffersService } from './hotel-offers.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-offers',
  imports: [CommonModule],
  templateUrl: './hotel-offers.component.html',
  styleUrl: './hotel-offers.component.scss'
})
export class HotelOffersComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  loading = true;
  error: string | null = null;
  city: string = 'All';
  starRating: string = 'All';
  price: string = 'All';

  constructor(private hotelOffersService: HotelOffersService, private router: Router) {}

  ngOnInit() {
    this.hotelOffersService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.filteredHotels = [...this.hotels];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load hotel offers.';
        this.loading = false;
      }
    });
  }

  updateFilter(event: Event, filterType: string): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (filterType === 'city') {
      this.city = value;
    } else if (filterType === 'starRating') {
      this.starRating = value;
    } else if (filterType === 'price') {
      this.price = value;
    }
    this.filterData();
  }

  filterData(): void {
    this.filteredHotels = [...this.hotels];
    if (this.city !== 'All') {
      this.filteredHotels = this.filteredHotels.filter(e => e.address && e.address.includes(this.city));
    }
    if (this.starRating !== 'All') {
      const starRatingNum = parseInt(this.starRating);
      this.filteredHotels = this.filteredHotels.filter(e => e.rating === starRatingNum);
    }
    if (this.price !== 'All') {
      if (this.price === 'Above 500$') {
        this.filteredHotels = this.filteredHotels.filter(e => e.price > 500);
      } else if (this.price === '300$-500$') {
        this.filteredHotels = this.filteredHotels.filter(e => e.price > 300 && e.price <= 500);
      } else if (this.price === 'Less Than 300$') {
        this.filteredHotels = this.filteredHotels.filter(e => e.price < 300);
      }
    }
  }

  get uniqueCities(): string[] {
    const cities = this.hotels.map(h => h.address).filter(v => !!v);
    return Array.from(new Set(cities));
  }

  viewDetails(hotel: Hotel) {
    this.router.navigate(['/dashboard/tourist/hotel-details', hotel.hotelID]);
  }
}

// Interfaces
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
