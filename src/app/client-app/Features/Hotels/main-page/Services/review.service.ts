import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Review } from '../interfaces/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'https://fizo.runasp.net/api/Reviews';
 constructor(private http: HttpClient) {}

  getReviewsByHotelId(hotelId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`).pipe(
      tap(response => console.log('API Response (GetReviewsByHotelId):', response)),
      catchError(this.handleError)
    );
  }
getReviewsByGuideId(guideId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/guide/${guideId}`).pipe(
      tap(response => console.log('API Response (GetReviewsByGuideId):', response)),
      catchError(this.handleError)
    );
  }
    private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching review data.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
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
