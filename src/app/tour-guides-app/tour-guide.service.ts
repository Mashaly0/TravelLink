import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashBoard } from './interfaces/dashboard';
import { TourGuide } from './interfaces/tour-guide';
import { log } from 'console';
import { Destination } from '../tourism-company-app/interfaces/package';

@Injectable({
  providedIn: 'root'
})
export class TourGuideService {
  getTopTourGuides(): Observable<TourGuide[]> {
    return this.client.get<TourGuide[]>(this.baseUrl + '/TourGuides', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
  }

  dashboardSubject = new BehaviorSubject<DashBoard>({});
  dashboard$ = this.dashboardSubject.asObservable();


  baseUrl: string = 'https://fizo.runasp.net/api';
  constructor(private client: HttpClient) {
    // localStorage.setItem("tourGuideToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YjdhNjMyOC0wNTU2LTQ1Y2MtYjcwOC1kYTA5Njg4OWVjMWIiLCJqdGkiOiJiMTMyZGIxNi1lMzJkLTRhNTYtOGMzZi1kNWNkZTAwMTczMWUiLCJlbWFpbCI6Im1vaGFtZWQuaGFzc2FuQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVG91ckd1aWRlIiwicm9sZXMiOiJUb3VyR3VpZGUiLCJleHAiOjE3NTU0NDE2NTAsImlzcyI6IkVneXB0VHJpcEFwaSIsImF1ZCI6IkVneXB0VHJpcEFwaSJ9.WzKX4XEWDaYHhMmgFNo-RImjUn7OoTLqsp57iGIiVF4");
  }

  getTourGuideDashBoard() {
    this.client.get<DashBoard>(this.baseUrl + '/DashBoard/tourguide', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe(
      (tourGuideDashBoard) => {
        this.dashboardSubject.next(tourGuideDashBoard);
      }
    );
  }

  editTourGuide(formData: FormData): Observable<TourGuide> {
    return this.client.put<TourGuide>(this.baseUrl + '/TourGuides/' + formData.get('guideID'), formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, });
  }

  getDestinations(): Observable<Destination[]> {
    return this.client.get<Destination[]>(this.baseUrl + '/Destinations')
  }
}
