export interface Review {
  reviewId: string;
  userId: string;
  hotelId: string;
  packageId: string | null;
  guideId: string | null;
  rating: number;
  comment: string;
  reviewDate: string;
  userEmail: string;
  hotelName: string;
  packageName: string | null;
  guideName: string | null;
}