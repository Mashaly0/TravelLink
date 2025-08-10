import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { DashBoard } from '../interfaces/dashboard';
import { TourGuideService } from '../tour-guide.service';

@Component({
  selector: 'app-tour-guides-component',
  imports: [RouterModule],
  templateUrl: './tour-guides-component.component.html',
  styleUrl: './tour-guides-component.component.scss'
})
export class TourGuidesMainComponent {

}
