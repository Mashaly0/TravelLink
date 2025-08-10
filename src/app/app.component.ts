import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './landing-app/Components/auth-service.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet,],
  providers: []
})
export class AppComponent {
  title = 'TripLink';

  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIfLoggedIn();
    }
  }

  private checkIfLoggedIn() {
    let token = this.authService.getToken();

    if (token) {
      this.authService.navigateBasedOnRole();
    } else {
      this.authService.navigateToHome();
    }
  }
}
