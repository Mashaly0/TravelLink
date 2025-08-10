import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TouristNavbarComponent } from '../tourist-navbar/tourist-navbar.component';

@Component({
  selector: 'app-tourist-component',
  imports: [RouterOutlet, TouristNavbarComponent],
  templateUrl: './tourist-component.component.html',
  styleUrl: './tourist-component.component.scss'
})
export class TouristComponent {

}
