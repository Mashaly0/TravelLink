import { Review } from "../../tour-guides-app/interfaces/review";

export interface HotelDashBoard {
    hotel?: Hotel;
    rooms?: Room[];
    bookings?: Booking[];
    reviews?: Review[];
    averageRating?: number;
}

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

export interface Room {
    roomId?: string;
    hotelId?: string;
    roomType?: string;
    pricePerNight?: number;
    isAvailable?: boolean;
    hotelName?: string;
    photoUrls?: string[];
}

export interface Booking {
    bookingID: string;
    touristEmail: string;
    tourGuideName: string;
    tourGuideEmail: string;
    hotelName: string;
    roomType: string;
    packageName: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
    packageId?: string;
    roomId?: string;
    hotelEmail?: string;
}
