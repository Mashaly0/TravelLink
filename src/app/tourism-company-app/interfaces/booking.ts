export interface Booking {
    bookingID: string;
    touristEmail: string;
    tourGuideName: string | null;
    hotelName: string;
    roomType: string;
    packageName: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
}