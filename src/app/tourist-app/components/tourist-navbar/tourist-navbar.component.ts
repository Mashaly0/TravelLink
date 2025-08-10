import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../landing-app/Components/auth-service.service';

@Component({
  selector: 'app-tourist-navbar',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './tourist-navbar.component.html',
  styleUrl: './tourist-navbar.component.scss'
})
export class TouristNavbarComponent {
  dropdownOpen = false;
  username = '';

  constructor(private authService: AuthService, private router: Router) {
    this.username = localStorage.getItem('email')!;
  }

  showDropdown() {
    this.dropdownOpen = true;
  }

  hideDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
