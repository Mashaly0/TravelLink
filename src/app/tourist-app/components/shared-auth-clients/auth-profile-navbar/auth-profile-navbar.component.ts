import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-profile-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './auth-profile-navbar.component.html',
  styleUrl: './auth-profile-navbar.component.scss'
})
export class AuthProfileNavbarComponent {

  username = 'Mariam'; // Replace later with dynamic username from AuthService
  dropdownOpen = false;

  constructor(private router: Router) {}

  showDropdown() {
    this.dropdownOpen = true;
  }

  hideDropdown() {
    this.dropdownOpen = false;
  }

  signOut() {
    console.log('Signing out...');
    // localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}

