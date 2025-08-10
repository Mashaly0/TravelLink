export interface Review {
    reviewId: string;
    userId: string;
    hotelId: string;
    packageId: string;
    guideId: string;
    rating: number;
    comment: string;
    reviewDate: Date;
    userEmail: string;
    hotelName: string;
    packageName: string;
    guideName: string;
}
