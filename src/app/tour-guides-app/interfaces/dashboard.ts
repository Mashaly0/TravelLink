import { Booking } from "../../tourism-company-app/interfaces/booking";
import { Review } from "./review";
import { TourGuide } from "./tour-guide";

export interface DashBoard {
    tourGuide?: TourGuide,
    bookings?: Booking[],
    reviews?: Review[],
    averageRating?: string,
}