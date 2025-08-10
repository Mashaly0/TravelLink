import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, viewChild } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})

export class HeroSectionComponent implements OnInit, OnDestroy {
  sliderContainer = viewChild<ElementRef<HTMLDivElement>>('sliderContainer');

  slides = [
    {
      country: 'France',
      image: '/images/7YrobQvFFzw8aWsAUtoYXB.jpg',
      tagline: 'See France through our eyes',
      title: 'Paris',
      population: '67.41 M',
      territory: '551.500 KM²',
      avgPrice: '$425.600'
    },
    {
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913',
      tagline: 'See Italy through our eyes',
      title: 'Rome',
      population: '59.11 M',
      territory: '301.340 KM²',
      avgPrice: '$385.200'
    },
    {
      country: 'Spain',
      image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216',
      tagline: 'See Spain through our eyes',
      title: 'Barcelona',
      population: '47.35 M',
      territory: '505.990 KM²',
      avgPrice: '$295.800'
    }
  ];

  currentIndex: number = 0;
  slideCount: number = this.slides.length;
  private slideInterval: any;
  private keyboardListener: (() => void) | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
      this.updateSlider();
      this.setupKeyboardNavigation();
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    if (this.keyboardListener && isPlatformBrowser(this.platformId)) {
      this.keyboardListener();
    }
  }

  updateSlider(): void {
    const container = this.sliderContainer()?.nativeElement;
    if (container && isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(container, 'transform', `translateX(-${this.currentIndex * 100}%)`);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
    this.updateSlider();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.updateSlider();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.updateSlider();
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  setupKeyboardNavigation(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.keyboardListener = this.renderer.listen('document', 'keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          this.nextSlide();
        } else if (e.key === 'ArrowLeft') {
          this.prevSlide();
        }
      });
    }
  }

  onMouseEnter(): void {
    this.stopAutoSlide();
  }

  onMouseLeave(): void {
    this.startAutoSlide();
  }
}


