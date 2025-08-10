import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from './login/user';
import { map, Observable, tap } from 'rxjs';
import { DecodedToken } from './decoded-token';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { HotelDashBoard } from '../../hotels-app/interfaces/hotel-dashboard';
import { TourGuide } from '../../tour-guides-app/interfaces/tour-guide';
import { Tourist } from '../../tourist-app/components/tourist';
import { ResetPassword } from './reset-password';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logout() {
    localStorage.clear();
    this.navigateToLogin();
  }

  baseUrl = 'https://fizo.runasp.net/api/Account';

  client = inject(HttpClient);

  id: string = '';

  toastService = inject(ToastrService);


  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private matDialog: MatDialog) {
  }


  public currentUser: Observable<User | null> | undefined;

  loginWithGoogle(): void {
    window.location.href = 'https://fizo.runasp.net/api/ExternalAuth/signin?provider=Google';
  }

  handleGoogleCallback(token: string | null): void {
    if (token) {
      console.log('token received : ' + token);
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      this.router.navigate(['/']);
    } else {
      alert('Login failed');
      this.router.navigate(['/login']);
    }
  }

  login(user: User): Observable<User> {
    console.log(user);

    return this.client.post<User>(
      this.baseUrl + '/login',
      {
        email: user.email,
        password: user.password,
      },
    ).pipe(
      tap(e => {
        console.log(e);
        this.saveUser(e);
        this.navigateBasedOnRole();
      })
    );
  }


  register(hotel: any, role: string) {
    this.client.post<User>(this.baseUrl + `/register/${role}`, hotel).subscribe(
      {
        next: (value) => {
          this.saveUser(value);
          this.toastService.success('This is a success message!', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });

          this.navigateToLogin();
        },
        error: (err: { error: { errors: [] } }) => {
          err.error.errors.map((e) => {
            this.toastService.error(e, '❌ Error', {
              toastClass: 'ngx-toastr custom-error'
            });
          });
        }
      }
    );
  }

  navigateToLogin() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
    }
  }

  public getRoleFromToken() {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded.roles;

    return role;
  }

  public getDecodedToken() {
    const token = this.getToken();
    if (!token) {
      console.warn('No token found in localStorage!');
      return null;
    }
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
  public saveUser(user: User): void {
    localStorage.removeItem('token');
    localStorage.setItem('token', user.token!);
  }

  public navigateToHome(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/']);
    }
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  getHotelId(): Observable<string | undefined> {
    console.log(`token in hotel ${this.getToken()}`);

    return this.client.get<HotelDashBoard>('https://fizo.runasp.net/api/Dashboard/hotel', {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(map(e => {
      const id = e.hotel?.hotelID;
      this.id = id!;
      localStorage.setItem('id', e.hotel?.hotelID!);
      return e.hotel?.hotelID!;
    }));
  }
  getCompanyId(): Observable<string | undefined> {
    console.log(`token in company ${this.getToken()}`);

    return this.client.get<any>('https://fizo.runasp.net/api/Dashboard/tourismcompany', {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe((map(e => {
      const id = e.companyID;
      this.id = id;
      localStorage.setItem('id', e.companyID);
      return id;
    })))
  }
  getTouristId(): Observable<string | undefined> {
    console.log(`token in tourist ${this.getToken()}`);

    return this.client.get<Tourist>('https://fizo.runasp.net/api/Dashboard/tourist', {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(map(e => {
      const id = e.userID;
      this.id = id!;
      localStorage.setItem('id', e.userID);
      return e.userID;
    }));
  }
  getTourGuideId(): Observable<string | undefined> {
    console.log(`token in tour guide ${this.getToken()}`);

    return this.client.get<TourGuide>('https://fizo.runasp.net/api/Dashboard/tourguide', {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    }).pipe(map(e => {
      this.id = e.guideID!;
      localStorage.setItem('id', e.guideID!);
      return e.guideID;
    }));
  }

  public navigateBasedOnRole(): void {
    const role = this.getRoleFromToken();
    const options = { replaceUrl: true };

    if (!role) {
      this.router.navigate(['/']);
      return;
    }

    switch (role.toLowerCase()) {
      case 'hotel':
        this.getHotelId().subscribe(id => {
          this.id = id!;
          this.router.navigateByUrl('/hotel/dashboard', options);
        });
        break;

      case 'tourismcompany':
        this.getCompanyId().subscribe(id => {
          this.id = id!;
          this.router.navigateByUrl('/company/dashboard', options);
        });
        break;

      case 'tourist':
        this.getTouristId().subscribe(id => {
          this.id = id!;
          this.router.navigateByUrl('', options);
        });
        break;

      case 'tourguide':
        this.getTourGuideId().subscribe(id => {
          this.id = id!;
          this.router.navigateByUrl('/tour-guide/dashboard', options);
        });
        break;
      case 'admin':
        this.router.navigateByUrl('/admin/dashboard', options);
        break;

      default:
        this.router.navigate(['/']);
        break;
    }
  }

  sendResetEmail(email: string) {
    return this.client.post('https://fizo.runasp.net/api/Account/forgotpassword', {
      "email": email,
      "ClientUri": "http://localhost:4200"
    });
  }

  sendNewPassword(resetPassword: ResetPassword) {
    return this.client.post('https://fizo.runasp.net/api/Account/resetpassword', resetPassword);
  }
}


