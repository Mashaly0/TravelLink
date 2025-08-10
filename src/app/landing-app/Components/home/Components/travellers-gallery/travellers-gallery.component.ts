import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-travellers-gallery',
  imports: [CommonModule],
  templateUrl: './travellers-gallery.component.html',
  styleUrl: './travellers-gallery.component.scss'
})
export class TravellersGalleryComponent {
 galleryItems = [
    { src: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21', alt: 'Traveler in Egypt', caption: 'Cairo Pyramid Tour' },
    { src: 'https://images.unsplash.com/photo-1520250497591-112f408f6a1f', alt: 'Nile Cruise', caption: 'Luxury Nile Cruise' },
    { src: 'https://images.unsplash.com/photo-1585506942812-e72b29cef752', alt: 'Desert Safari', caption: 'Desert Adventure' },
    { src: 'https://images.unsplash.com/photo-1575408264798-b50b252663e6', alt: 'Luxor Temple', caption: 'Luxor Temple Visit' },
    { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', alt: 'Red Sea Diving', caption: 'Red Sea Diving' },
    { src: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88', alt: 'Egyptian Market', caption: 'Local Market Tour' }
  ];

  selectedImage: { src: string; caption: string } | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  openLightbox(item: { src: string; caption: string }) {
    if (isPlatformBrowser(this.platformId)) {
      this.selectedImage = item;
    }
  }

  closeLightbox() {
    this.selectedImage = null;
  }
}
