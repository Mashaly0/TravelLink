import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./Components/auth-service.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token) {
      return true;
    }

    return false;
  }
}