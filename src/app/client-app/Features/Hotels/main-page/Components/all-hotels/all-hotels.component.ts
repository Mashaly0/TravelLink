import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../../../../shared-app/Components/navbar/navbar.component';
import { HotelsServiceService } from '../../Services/hotels-service.service';
import { Hotel } from '../../interfaces/hotel';
@Component({
  selector: 'app-all-hotels',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './all-hotels.component.html',
  styleUrls: ['./all-hotels.component.scss']
})
export class AllHotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  currentPage = 1;
  errorMessage: string | null = null;
  filters = {
    city: 'All',
    starRating: 'All',
    price: 'All'
  };
  currentImageIndices: number[] = []; // Track current image index for each hotel

  constructor(@Inject(HotelsServiceService) private hotelService: HotelsServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        console.log('Hotels received in AllHotelsComponent:', hotels);
        this.hotels = hotels;
        this.filteredHotels = [...hotels];
        this.currentImageIndices = new Array(hotels.length).fill(0); // Initialize image indices

        this.applyFilters();
      },
      error: (err) => {
        console.error('Error in AllHotelsComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  extractCity(address: string): string {
    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : 'Unknown';
  }

  updateFilter(event: Event, filterType: string): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filters[filterType as keyof typeof this.filters] = selectElement.value;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.hotels];

    // City filter
    if (this.filters.city !== 'All') {
      filtered = filtered.filter(hotel => this.extractCity(hotel.address) === this.filters.city);
    }

    // Star rating filter
    if (this.filters.starRating !== 'All') {
      filtered = filtered.filter(hotel => Math.round(hotel.rating) === parseInt(this.filters.starRating));
    }

    // Price filter (placeholder logic)
    if (this.filters.price !== 'All') {
      // Since price is not in API, use placeholder logic or update when price is available
      filtered = filtered.filter(hotel => {
        const placeholderPrice = 100; // Replace with actual price when available
        if (this.filters.price === 'Above 500$') return placeholderPrice > 500;
        if (this.filters.price === '300$-500$') return placeholderPrice >= 300 && placeholderPrice <= 500;
        if (this.filters.price === 'Less Than 300$') return placeholderPrice < 300;
        return true;
      });
    }

    this.filteredHotels = filtered;
  }

  getHotelSlug(hotelName: string): string {
    const hotel = this.hotels.find(h => h.hotelName === hotelName);
    return hotel ? `${hotelName.toLowerCase().replace(/\s+/g, '-')}-${hotel.hotelID}` : '';
  }

  getStarRatingArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarRatingArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  goToDetails(index: number): void {
    const hotel = this.filteredHotels[index];
    this.router.navigate(['/hotel-details', hotel.hotelID]);
  }


  prevImage(index: number, event: Event): void {
    event.stopPropagation(); // Prevent routerLink navigation
    if (this.filteredHotels[index].photoUrls && this.filteredHotels[index].photoUrls.length > 0) {
      this.currentImageIndices[index] = (this.currentImageIndices[index] - 1 + this.filteredHotels[index].photoUrls.length) % this.filteredHotels[index].photoUrls.length;
    }
  }

  nextImage(index: number, event: Event): void {
    event.stopPropagation(); // Prevent routerLink navigation
    if (this.filteredHotels[index].photoUrls && this.filteredHotels[index].photoUrls.length > 0) {
      this.currentImageIndices[index] = (this.currentImageIndices[index] + 1) % this.filteredHotels[index].photoUrls.length;
    }
  }
}