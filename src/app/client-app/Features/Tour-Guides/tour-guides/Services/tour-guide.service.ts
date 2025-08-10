import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { TourGuide } from '../interfaces/tour-guide';

@Injectable({
  providedIn: 'root'
})
export class TourGuideService {
private apiUrl = 'https://fizo.runasp.net/api/TourGuides';

  constructor(private http: HttpClient) {}

  getAllTourGuides(): Observable<TourGuide[]> {
    return this.http.get<TourGuide[]>(this.apiUrl).pipe(
      tap(response => console.log('API Response (GetAllTourGuides):', response)),
      catchError(this.handleError)
    );
  }

  getTourGuideById(guideId: string): Observable<TourGuide> {
    return this.http.get<TourGuide>(`${this.apiUrl}/${guideId}`).pipe(
      tap(response => console.log('API Response (GetTourGuideById):', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching tour guide data.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      if ((error.status === 400 || error.status === 404) && error.error.Errors) {
        errorMessage = `Server Error: ${error.error.Errors.join(', ')}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
