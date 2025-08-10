import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TourGuide } from '../interfaces/tour-guide';
import { TourGuideService } from '../Services/tour-guide.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-tour-gudies',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './all-tour-gudies.component.html',
  styleUrl: './all-tour-gudies.component.scss'
})
export class AllTourGudiesComponent implements OnInit {
  tourGuides: TourGuide[] = [];
  filteredTourGuides: TourGuide[] = [];
  availableLanguages: string[] = [];
  selectedLanguage: string = '';
  errorMessage: string | null = null;
  currentImageIndices: number[] = [];
  currentPage = 1;

  constructor(@Inject(TourGuideService) private tourGuideService: TourGuideService) { }

  ngOnInit(): void {
    this.loadTourGuides();
  }

  loadTourGuides(): void {
    this.tourGuideService.getAllTourGuides().subscribe({
      next: (guides) => {
        console.log('Tour guides received in AllTourGuidesComponent:', guides);
        this.tourGuides = guides;
        this.filteredTourGuides = guides;
        this.currentImageIndices = new Array(guides.length).fill(0); // Initialize image indices
        this.extractLanguages();
        console.log('Available languages:', this.availableLanguages);
      },
      error: (err) => {
        console.error('Error in AllTourGuidesComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  extractLanguages(): void {
    const languageSet = new Set<string>();
    this.tourGuides.forEach(guide => {
      if (guide.languages) {
        guide.languages.split(',').forEach(lang => {
          const trimmedLang = lang.trim();
          if (trimmedLang) languageSet.add(trimmedLang);
        });
      }
    });
    this.availableLanguages = Array.from(languageSet).sort();
  }

  filterTourGuides(): void {
    if (!this.selectedLanguage) {
      this.filteredTourGuides = this.tourGuides;
    } else {
      this.filteredTourGuides = this.tourGuides.filter(guide => {
        if (!guide.languages) return false;
        const guideLanguages = guide.languages.split(',').map(lang => lang.trim().toLowerCase());
        return guideLanguages.includes(this.selectedLanguage.toLowerCase());
      });
    }
    console.log('Filtered tour guides:', this.filteredTourGuides);
  }

  getStarRatingArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarRatingArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }
  prevImage(index: number): void {
    if (this.filteredTourGuides[index].photoUrls && this.filteredTourGuides[index].photoUrls.length > 0) {
      this.currentImageIndices[index] = (this.currentImageIndices[index] - 1 + this.filteredTourGuides[index].photoUrls.length) % this.filteredTourGuides[index].photoUrls.length;
    }
  }

  nextImage(index: number): void {
    if (this.filteredTourGuides[index].photoUrls && this.filteredTourGuides[index].photoUrls.length > 0) {
      this.currentImageIndices[index] = (this.currentImageIndices[index] + 1) % this.filteredTourGuides[index].photoUrls.length;
    }
  }
}