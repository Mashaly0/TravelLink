import { Destination } from "./destination";

export interface TourPackage {
  packageId: string;
  companyId: string;
  packageName: string;
  description: string;
  price: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  companyName: string;
  destinations: Destination[];
  photoUrls: string[];
}