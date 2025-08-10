import { Component, OnInit } from '@angular/core';
import { TourPackage } from '../interfaces/tour-package';
import { TourPackageService } from '../Services/tour-package.service';
import { NavbarComponent } from "../../../../shared-app/Components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Destination } from '../interfaces/destination';
import { FormsModule } from '@angular/forms';
interface PriceRange {
  label: string;
  min: number | null;
  max: number | null;
}
@Component({
  selector: 'app-all-packages',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './all-packages.component.html',
  styleUrl: './all-packages.component.scss'
})
export class AllPackagesComponent implements OnInit {
  packages: TourPackage[] = [];
  filteredPackages: TourPackage[] = [];
  currentPage = 1;
  errorMessage: string | null = null;
  selectedPriceRange: string = '';
  selectedDestination: string = '';
  priceRanges: PriceRange[] = [
    { label: 'All Prices', min: null, max: null },
    { label: '$0-$100', min: 0, max: 100 },
    { label: '$101-$200', min: 101, max: 200 },
    { label: '$201-$300', min: 201, max: 300 },
    { label: '$301-$400', min: 301, max: 400 },
    { label: '$401-$700', min: 401, max: 700 },
    { label: '$701+', min: 701, max: null }
  ];
  availableDestinations: string[] = [];

  constructor(private tourPackageService: TourPackageService) { }

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.tourPackageService.getAllPackages().subscribe({
      next: (packages) => {
        console.log('Packages received in AllPackagesComponent:', packages);
        this.packages = packages;
        this.filteredPackages = [...packages];
        this.availableDestinations = this.getUniqueDestinations(packages);
      },
      error: (err) => {
        console.error('Error in AllPackagesComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  getUniqueDestinations(packages: TourPackage[]): string[] {
    const destinations = new Set<string>();
    packages.forEach(pkg => {
      pkg.destinations.forEach(dest => destinations.add(dest.name));
    });
    return ['All Destinations', ...Array.from(destinations).sort()];
  }

  getDestinationsString(destinations: Destination[]): string {
    return destinations.length > 0 ? destinations.map(d => d.name).join(', ') : 'None';
  }

  onPriceRangeChange(): void {
    this.errorMessage = null;
    if (!this.selectedPriceRange) {
      this.filteredPackages = [...this.packages];
      return;
    }
    const selectedRange = this.priceRanges.find(range => range.label === this.selectedPriceRange);
    if (selectedRange) {
      this.filteredPackages = this.packages.filter(pkg => {
        return (
          (selectedRange.min == null || pkg.price >= selectedRange.min) &&
          (selectedRange.max == null || pkg.price <= selectedRange.max)
        );
      });
      if (this.filteredPackages.length === 0) {
        this.errorMessage = `No packages match the selected price range: ${this.selectedPriceRange}.`;
      }
    }
  }

  onDestinationChange(): void {
    this.errorMessage = null;
    if (!this.selectedDestination || this.selectedDestination === 'All Destinations') {
      this.filteredPackages = [...this.packages];
      return;
    }
    this.filteredPackages = this.packages.filter(pkg =>
      pkg.destinations.some(dest => dest.name === this.selectedDestination)
    );
    if (this.filteredPackages.length === 0) {
      this.errorMessage = `No packages match the selected destination: ${this.selectedDestination}.`;
    }
  }

  resetFilters(): void {
    this.selectedPriceRange = '';
    this.selectedDestination = '';
    this.filteredPackages = [...this.packages];
    this.errorMessage = null;
  }
}