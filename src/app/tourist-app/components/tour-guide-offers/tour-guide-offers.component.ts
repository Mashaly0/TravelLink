import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-guide-offers',
  imports: [CommonModule],
  templateUrl: './tour-guide-offers.component.html',
  styleUrl: './tour-guide-offers.component.scss'
})
export class TourGuideOffersComponent implements OnInit {
  guides: TourGuide[] = [];
  filteredGuides: TourGuide[] = [];
  loading = true;
  error: string | null = null;
  language: string = 'All';
  area: string = 'All';
  price: string = 'All';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<TourGuide[]>('/api/TourGuides').subscribe({
      next: (data) => {
        this.guides = data;
        this.filteredGuides = [...this.guides];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tour guides.';
        this.loading = false;
      }
    });
  }

  updateFilter(event: Event, filterType: string): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (filterType === 'language') {
      this.language = value;
    } else if (filterType === 'area') {
      this.area = value;
    } else if (filterType === 'price') {
      this.price = value;
    }
    this.filterData();
  }

  filterData(): void {
    this.filteredGuides = [...this.guides];
    if (this.language !== 'All') {
      this.filteredGuides = this.filteredGuides.filter(g => g.languages && g.languages.includes(this.language));
    }
    if (this.area !== 'All') {
      this.filteredGuides = this.filteredGuides.filter(g => g.areasCovered && g.areasCovered.includes(this.area));
    }
    if (this.price !== 'All') {
      if (this.price === 'Above 100$') {
        this.filteredGuides = this.filteredGuides.filter(g => g.pricePerHour > 100);
      } else if (this.price === '50$-100$') {
        this.filteredGuides = this.filteredGuides.filter(g => g.pricePerHour > 50 && g.pricePerHour <= 100);
      } else if (this.price === 'Less Than 50$') {
        this.filteredGuides = this.filteredGuides.filter(g => g.pricePerHour < 50);
      }
    }
  }

  get uniqueLanguages(): string[] {
    const langs = this.guides.flatMap(g => g.languages ? g.languages.split(',').map(l => l.trim()) : []);
    return Array.from(new Set(langs)).filter(l => l);
  }

  get uniqueAreas(): string[] {
    const areas = this.guides.flatMap(g => g.areasCovered ? g.areasCovered.split(',').map(a => a.trim()) : []);
    return Array.from(new Set(areas)).filter(a => a);
  }

  viewDetails(guide: TourGuide) {
    this.router.navigate(['/dashboard/tourist/guide-details', guide.guideID]);
  }
}

export interface TourGuide {
  guideID: string;
  guideName: string;
  licenseNumber: string;
  languages: string;
  areasCovered: string;
  pricePerHour: number;
  contactEmail: string;
  contactPhone: string;
  averageRating: number;
  totalBookings: number;
  isAvailable: boolean;
  photoUrls: string[];
}
