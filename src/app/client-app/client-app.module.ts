import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourGuidesComponent } from './Features/Tour-Guides/tour-guides/tour-guides.component';
import { RouterModule } from '@angular/router';
import { AllTourGudiesComponent } from './Features/Tour-Guides/tour-guides/all-tour-gudies/all-tour-gudies.component';
import { MainPageComponent } from './Features/Hotels/main-page/main-page.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule , 
    TourGuidesComponent,
    HttpClientModule,
    RouterModule,
    AllTourGudiesComponent,
    MainPageComponent,
  ],
  exports : [TourGuidesComponent , AllTourGudiesComponent , MainPageComponent]
})
export class ClientAppModule { }
