import { Package } from "../../tourism-company-app/interfaces/package";
import { Room } from "./hotel-details/hotel-details.component";
import { TourGuide } from "./tour-guide-offers/tour-guide-offers.component";

export interface Trip {
    hotelsRooms: Room[][];
    tourGuides: TourGuide[];
    tourPackages: Package[];
}