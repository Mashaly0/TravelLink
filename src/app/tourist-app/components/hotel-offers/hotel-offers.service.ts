import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelOffersService {
  constructor(private http: HttpClient) { }

  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(`/api/Hotels`);
  }

  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(`/api/Rooms`);
  }
}
