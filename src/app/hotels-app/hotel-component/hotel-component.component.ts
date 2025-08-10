import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-hotel-component',
  imports: [RouterOutlet ],
  standalone: true,
  templateUrl: './hotel-component.component.html',
  styleUrl: './hotel-component.component.scss'
})
export class HotelComponent {

}
