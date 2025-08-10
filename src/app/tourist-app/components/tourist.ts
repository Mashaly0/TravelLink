import { Review } from "../../tour-guides-app/interfaces/review";

export interface Tourist {
    userID: string;
    email: string;
    name: string;
    bookings: Booking[];
    reviews: Review[];
}

export interface Booking {
    bookingID: string;
    touristEmail: string;
    tourGuideName: string;
    hotelName: string;
    roomType: string;
    packageName: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
}

export interface User {
    userID: string;
    email: string;
    name: string;
    bookings: Booking[];
    reviews: Review[];
}