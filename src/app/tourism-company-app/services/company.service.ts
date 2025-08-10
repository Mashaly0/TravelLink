import { inject, Injectable } from '@angular/core';
import { Booking } from '../interfaces/booking';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Destination, Package } from '../interfaces/package';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  deleteBooking(bookingId: any) {
    return this.httpClient.delete<Booking>(this.baseUrl + "/Bookings/" + bookingId, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).pipe(
      tap(() => {
        const newList = this.bookingsSubject.value.filter((p) => p.bookingID != bookingId);
        this.bookingsSubject.next(newList);
      })
    );
  }

  private packagesSubject = new BehaviorSubject<Package[]>([]);
  packages$ = this.packagesSubject.asObservable();
  bookingsSubject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();
  private destinationSubject = new BehaviorSubject<Destination[]>([]);
  destinations$ = this.destinationSubject.asObservable();

  constructor() { }

  baseUrl: string = 'https://fizo.runasp.net/api';

  httpClient = inject(HttpClient);

  companyId = localStorage.getItem('id');

  getCompanyBookings() {
    this.httpClient.get<Booking[]>(this.baseUrl + "/Bookings/provider/" + localStorage.getItem('email')!).subscribe(
      (bookings) => this.bookingsSubject.next(bookings),
    );
  }

  getCompanyPackages() {
    this.httpClient.get<Package[]>(this.baseUrl + "/TourPackages/company/" + this.companyId).subscribe((companyPackage) => {
      this.packagesSubject.next(companyPackage);
    });
  }

  getPackageById(packageId: string): Observable<Package> {
    return this.httpClient.get<Package>(this.baseUrl + "/TourPackages/" + packageId);
  }

  editPackage(formData: FormData, id: string): Observable<Package> {
    return this.httpClient.put<Package>(this.baseUrl + "/TourPackages/" + id, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
  }
  deletePackage(deletedPackageId: string) {
    return this.httpClient.delete<Package>(this.baseUrl + "/TourPackages/" + deletedPackageId, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).pipe(
      tap(() => {
        const newList = this.packagesSubject.value.filter((p) => p.packageId != deletedPackageId);
        this.packagesSubject.next(newList);
      })
    );
  }


  createPackage(formData: FormData): Observable<Package> {
    return this.httpClient.post<Package>(this.baseUrl + "/TourPackages", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    },);
  }

  getDestinations() {
    this.httpClient.get<Destination[]>(this.baseUrl + "/Destinations").subscribe(
      (destinations) => { this.destinationSubject.next(destinations); }
    );
  }
}
