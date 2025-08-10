import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";
import { HeroSectionComponent } from "./Components/hero-section/hero-section.component";
import { WhoUsComponentComponent } from "./Components/who-us-component/who-us-component.component";
import { TravellersGalleryComponent } from "./Components/travellers-gallery/travellers-gallery.component";
import { HotelsService } from '../../../hotels-app/hotels-service.service';
import { TourPackageService } from '../../../client-app/Features/tour-packages/Services/tour-package.service';
import { TourGuideService } from '../../../tour-guides-app/tour-guide.service';
import { TourGuide } from '../../../tour-guides-app/interfaces/tour-guide';
import { CommonModule } from '@angular/common';
import { Package } from '../../../tourism-company-app/interfaces/package';
import { TourPackage } from '../../../client-app/Features/tour-packages/interfaces/tour-package';
import { Hotel } from '../../../hotels-app/interfaces/hotel-dashboard';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Review } from '../../../tour-guides-app/interfaces/review';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, CommonModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {


  isPackagesReqFinished = false;
  isHotelsReqFinished = false;
  isGuidesReqFinished = false;
  selectedImage = 0;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.slideThroughImage();
    this.guideService.getTopTourGuides().subscribe(
      {
        next: (value) => {
          this.topTourGuides = value;
          this.isGuidesReqFinished = true;
          this.topTourGuides = this.topTourGuides.sort((a, b) => b.averageRating! - a.averageRating!);
          this.guidesNumber = this.topTourGuides.length;
          this.topTourGuides = this.topTourGuides.slice(0, 3);
          console.log(this.topTourGuides);

        },
      }
    );
    this.packageService.getTopPackages().subscribe(
      {
        next: (value) => {
          this.topTourPackages = value;
          this.isPackagesReqFinished = true;
          this.topTourPackages = this.topTourPackages.sort((a, b) => b.price! - a.price!);
          this.packagesNumber = this.topTourPackages.length;
          this.topTourPackages = this.topTourPackages.slice(0, 3);
          console.log(this.topTourPackages);

        },
      }
    );
    this.hotelService.getTopHotels().subscribe(
      {
        next: (value) => {
          this.topHotels = value;
          this.isHotelsReqFinished = true;
          this.topHotels = this.topHotels.sort((a, b) => b.rating! - a.rating!);
          this.hotelsNumber = this.topHotels.length;
          this.topHotels = this.topHotels.slice(0, 3);
          console.log(this.topHotels);

        },
      }
    );
    this.hotelService.getTopReviews().subscribe(
      {
        next: (value) => {
          this.topReviews = value;
          this.topReviews = this.topReviews.sort((a, b) => b.rating! - a.rating!);
          this.topReviews = this.topReviews.slice(0, 3);
        },
      }
    );
    this.guideService.getTopTourGuides();
    this.packageService.getTopPackages();
    this.hotelService.getTopHotels();
    this.hotelService.getTopReviews();
  }

  topTourGuides: TourGuide[] = [];
  topTourPackages: TourPackage[] = [];
  topHotels: Hotel[] = [];
  topReviews: Review[] = [];

  hotelService = inject(HotelsService);

  packageService = inject(TourPackageService);

  guideService = inject(TourGuideService);

  hotelsNumber = 0;
  guidesNumber = 0;
  packagesNumber = 0;

  sliderData: { title: string, image: string }[] = [
    {
      title: 'Visit great places in Egypt',
      image: '/images/pyramids.jpeg'
    },
    {
      title: 'Where you see incredible views',
      image: '/images/stanley.jpeg'
    },
    {
      title: 'And Take a look through history',
      image: '/images/temple.jpg'
    },
  ];

  slideThroughImage() {
    setInterval(() => {
      this.selectedImage = ++this.selectedImage % 3;
    }, 2000)
  }

  moveToNextImage() {
    this.selectedImage = ++this.selectedImage % 3;
  }
  moveToPreImage() {
    this.selectedImage = --this.selectedImage % 3;
  }


}
