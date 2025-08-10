import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Hotel } from '../interfaces/hotel';
import { Room } from '../interfaces/room';
@Injectable({
  providedIn: 'root'
})
export class HotelsServiceService {
  private apiUrl = 'https://fizo.runasp.net/api';
  constructor(private http: HttpClient) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/Hotels`).pipe(
      tap(response => console.log('API Response (GetAllHotels):', response)),
      catchError(this.handleError)
    );
  }

  getHotelById(hotelId: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/Hotels/${hotelId}`).pipe(
      tap(response => console.log('API Response (GetHotelById):', response)),
      catchError(this.handleError)
    );
  }

  getHotelRooms(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/Hotels/${hotelId}/rooms`).pipe(
      tap(response => console.log('API Response (GetHotelRooms):', response)),
      catchError(this.handleError)
    );
  }

  getRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/Rooms/${roomId}`).pipe(
      tap(response => console.log('API Response (GetRoomById):', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching data.';
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