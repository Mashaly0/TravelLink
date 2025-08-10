import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { TourPackage } from '../interfaces/tour-package';
import { Review } from '../../Hotels/main-page/interfaces/review';

@Injectable({
  providedIn: 'root'
})
export class TourPackageService {
  getTopPackages(): Observable<TourPackage[]> {
    return this.http.get<TourPackage[]>(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  private apiUrl = 'https://fizo.runasp.net/api/TourPackages';
  private reviewsApiUrl = 'https://fizo.runasp.net/api/Reviews/package';
  private bookingsApiUrl = 'https://fizo.runasp.net/api/Bookings/package';

  constructor(private http: HttpClient) { }

  getAllPackages(): Observable<TourPackage[]> {
    return this.http.get<TourPackage[]>(this.apiUrl).pipe(
      tap(response => console.log('API Response (GetAllPackages):', response)),
      catchError(this.handleError)
    );
  }

  bookPackage(bookingData: { touristEmail: string, packageId: string, bookingDate: string, totalPrice: number }): Observable<{ bookingID: string, message: string }> {
    return this.http.post<{ bookingID: string, message: string }>(this.bookingsApiUrl, bookingData).pipe(
      catchError(this.handleError)
    );
  }
  getPackageById(packageId: string): Observable<TourPackage> {
    return this.http.get<TourPackage>(`${this.apiUrl}/${packageId}`).pipe(
      tap(response => console.log('API Response (GetPackageById):', response)),
      catchError(this.handleError)
    );
  }
  getReviewsByPackageId(packageId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.reviewsApiUrl}/${packageId}`).pipe(
      catchError(this.handleError)
    );
  }
  getPackagesByCompanyId(companyId: string): Observable<TourPackage[]> {
    return this.http.get<TourPackage[]>(`${this.apiUrl}/company/${companyId}`).pipe(
      tap(response => console.log('API Response (GetPackagesByCompanyId):', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching tour package data.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      if (error.error && error.error.Errors && Array.isArray(error.error.Errors)) {
        errorMessage = `Server Error: ${error.error.Errors.join(', ')}`;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = `Server Error: ${error.error}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message || 'Unknown error'}`;
      }
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}