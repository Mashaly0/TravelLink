import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,  } from '@angular/router';
import { NavbarComponent } from '../../../../shared-app/Components/navbar/navbar.component';
import { AllHotelsComponent } from "./Components/all-hotels/all-hotels.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AllHotelsComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent  {

}