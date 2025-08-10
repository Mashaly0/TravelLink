import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements AfterViewInit {

  constructor(
    @Inject(DOCUMENT) private document: Document, private authService: AuthService,
  ) { }

  token!: string
  ngAfterViewInit(): void {
    console.log('in component');
    this.token = this.getCookie('token')!;
    console.log(this.token + 'in cookies');
  }


  private getCookie(name: string): string | null {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(this.document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(cookieName) === 0) {
        this.authService.handleGoogleCallback(cookie.substring(cookieName.length, cookie.length));
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null; // Return null if cookie not found
  }

}
