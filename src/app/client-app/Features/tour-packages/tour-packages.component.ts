import { Component } from '@angular/core';
import { AllPackagesComponent } from "./all-packages/all-packages.component";
import { NavbarComponent } from "../../../shared-app/Components/navbar/navbar.component";

@Component({
  selector: 'app-tour-packages',
  imports: [AllPackagesComponent, NavbarComponent],
  templateUrl: './tour-packages.component.html',
  styleUrl: './tour-packages.component.scss'
})
export class TourPackagesComponent {

}
