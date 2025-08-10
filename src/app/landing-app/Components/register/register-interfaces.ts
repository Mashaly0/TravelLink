export interface TouristRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    preferences: string;
    favoriteDestinations: string;
}

export interface TourGuideRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    guideName: string;
    licenseNumber: string;
    languages: string;
    areasCovered: string;
    pricePerHour: number;
    contactEmail: string;
    contactPhone: string;
}

export interface HotelRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    hotelName: string;
    hotelAddress: string;
    description: string;
    rating: number;
    contactEmail: string;
    contactPhone: string;
}

export interface CompanyRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    companyName: string;
    licenseNumber: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
}