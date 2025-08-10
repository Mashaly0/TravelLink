import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { HotelBooking } from '../Hotels/main-page/interfaces/hotel-booking';
import { TourGuideBooking } from '../Hotels/main-page/interfaces/tour-guide-booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://fizo.runasp.net/api/Bookings';
 constructor(private http: HttpClient) {}

  createHotelBooking(booking: HotelBooking): Observable<any> {
    return this.http.post(`${this.apiUrl}/hotel`, booking).pipe(
      tap(response => console.log('API Response (CreateHotelBooking):', response)),
      catchError(this.handleError)
    );
  }
 createTourGuideBooking(booking: TourGuideBooking): Observable<any> {
    return this.http.post(`${this.apiUrl}/tourguide`, booking).pipe(
      tap(response => console.log('API Response (CreateTourGuideBooking):', response)),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while creating the booking.';
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