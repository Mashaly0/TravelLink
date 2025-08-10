
export interface Room {
  roomId: string;
  hotelId: string;
  roomType: string;
  pricePerNight: number;
  isAvailable: boolean;
  hotelName: string;
  photoUrls: string[];
}