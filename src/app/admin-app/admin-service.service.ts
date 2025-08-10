import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Admin } from "./admin";
import { Hotel } from "../hotels-app/interfaces/hotel-dashboard";
import { TourGuide } from "../tour-guides-app/interfaces/tour-guide";
import { Package } from "../tourism-company-app/interfaces/package";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  client = inject(HttpClient);

  baseUrl = 'https://fizo.runasp.net/api/';

  getAdminDashboard(): Observable<Admin> {
    return this.client.get<Admin>(this.baseUrl + 'Dashboard/admin', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getAllHotels(): Observable<Hotel[]> {
    return this.client.get<Hotel[]>(this.baseUrl + 'Hotels');
  }
  getAllGuides(): Observable<TourGuide[]> {
    return this.client.get<TourGuide[]>(this.baseUrl + 'TourGuides');
  }
  getAllPackages(): Observable<Package[]> {
    return this.client.get<Package[]>(this.baseUrl + '/TourPackages');
  }


  verifyUser(userId: string) {
    return this.client.patch(this.baseUrl + `AdminUser/set-verified/${userId}`, {
      'isVerified': true,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
