import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TourGuide } from '../interfaces/tour-guide';
import { TourGuideService } from '../Services/tour-guide.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-tour-guides',
  imports: [CommonModule, RouterModule],
  templateUrl: './top-tour-guides.component.html',
  styleUrl: './top-tour-guides.component.scss'
})
export class TopTourGuidesComponent  implements OnInit {
  topTourGuides: TourGuide[] = [];
  errorMessage: string | null = null;
  currentImageIndices: number[] = []; // Track current image index for each guide

  constructor(@Inject(TourGuideService) private tourGuideService: TourGuideService) {}

  ngOnInit(): void {
    this.loadTopTourGuides();
  }

  loadTopTourGuides(): void {
    this.tourGuideService.getAllTourGuides().subscribe({
      next: (guides) => {
        console.log('Tour guides received in TopTourGuidesComponent:', guides);
        // Sort by averageRating (descending) and take top 3
        this.topTourGuides = guides
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 3);
        this.currentImageIndices = new Array(this.topTourGuides.length).fill(0); // Initialize image indices
      },
      error: (err) => {
        console.error('Error in TopTourGuidesComponent:', err.message);
        this.errorMessage = err.message;
      }
    });
  }

  getStarRatingArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarRatingArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  prevImage(index: number): void {
    if (this.topTourGuides[index].photoUrls && this.topTourGuides[index].photoUrls.length > 0) {
      this.currentImageIndices[index] = (this.currentImageIndices[index] - 1 + this.topTourGuides[index].photoUrls.length) % this.topTourGuides[index].photoUrls.length;
    }
  }

  nextImage(index: number): void {
    if (this.topTourGuides[index].photoUrls && this.topTourGuides[index].photoUrls.length > 0) {
      this.currentImageIndices[index] = (this.currentImageIndices[index] + 1) % this.topTourGuides[index].photoUrls.length;
    }
  }
}