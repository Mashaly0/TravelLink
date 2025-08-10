import { TourPackage } from "../client-app/Features/tour-packages/interfaces/tour-package";
import { Booking, Hotel } from "../hotels-app/interfaces/hotel-dashboard";
import { Review } from "../tour-guides-app/interfaces/review";
import { TourGuide } from "../tour-guides-app/interfaces/tour-guide";

export interface Admin {
    profit: number;
    totalUsers: number;
    totalBookings: number;
    totalReviews: number;
    recentBookings: Booking[];
    recentReviews: Review[];
    topHotels: Hotel[];
    topTourPackages: TourPackage[];
    topTourGuides: TourGuide[];
}