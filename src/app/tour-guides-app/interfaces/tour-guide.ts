export interface TourGuide {
    guideID?: string;
    guideName?: string;
    licenseNumber?: string;
    languages?: string;
    areasCovered?: string;
    pricePerHour?: number;
    contactEmail?: string;
    contactPhone?: string;
    averageRating?: number;
    totalBookings?: number;
    isAvailable?: boolean;
    photoUrls?: string[],
}