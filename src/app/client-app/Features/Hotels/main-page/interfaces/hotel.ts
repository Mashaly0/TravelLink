export interface Hotel {
  hotelID: string;
  hotelName: string;
  address: string;
  description: string;
  rating: number;
  contactEmail: string;
  contactPhone: string;
  totalRooms: number;
  availableRooms: number;
  photoUrls: string[];
}