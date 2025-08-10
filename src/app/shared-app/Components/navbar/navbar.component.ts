
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../landing-app/Components/auth-service.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);

  isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  logout() {
    this.authService.logout();
  }

  showActions() {
    const element = (document.getElementsByClassName('actions-list')[0] as HTMLElement);
    if (element.style.opacity == '0') {
      element.style.opacity = String(1);
    }
    else {
      element.style.opacity = String(0);
    }
  }

  currentRole() {
    return this.authService.getRoleFromToken().toLowerCase();
  }
}
