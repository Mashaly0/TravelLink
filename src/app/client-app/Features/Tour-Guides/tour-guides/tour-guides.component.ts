import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../../../shared-app/Components/navbar/navbar.component";
import { AllTourGudiesComponent } from "./all-tour-gudies/all-tour-gudies.component";
import { TopTourGuidesComponent } from "./top-tour-guides/top-tour-guides.component";

@Component({
  selector: 'app-tour-guides',
  standalone: true,
  imports: [CommonModule, RouterModule, AllTourGudiesComponent, TopTourGuidesComponent, NavbarComponent],
  templateUrl: './tour-guides.component.html',
  styleUrls: ['./tour-guides.component.scss']
})
export class TourGuidesComponent {
  tourGuides = [
    {
      id: 'guide1',
      name: 'أحمد علي',
      specialty: 'Egyptology',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      skills: ['Ancient Egyptian History', 'Multilingual: Arabic & English', 'Certified National Guide'],
      fixedTrips: ['Pyramids of Giza + Sphinx', 'Egyptian Museum', 'Khan El Khalili Market']
    },
    {
      id: 'guide2',
      name: 'فاطمة حسن',
      specialty: 'Nile Cruises',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      skills: ['Nile Cruise Management', 'Multilingual: Arabic & French', 'Expert in Egyptian Culture'],
      fixedTrips: ['Luxor & Aswan Nile Cruise', 'Karnak Temple', 'Valley of the Kings']
    },
    {
      id: 'guide3',
      name: 'محمد حسن',
      specialty: 'Desert Safaris',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      skills: ['Desert Safari Leadership', 'Multilingual: Arabic & English', 'Camping Expertise'],
      fixedTrips: ['Bahariya Oasis Safari', 'White Desert', 'Bedouin Experience']
    },
    {
      id: 'guide4',
      name: 'مروة ناجي',
      specialty: 'Desert Safaris',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      skills: ['Desert Trip Organization', 'Multilingual: Arabic & Spanish', 'Photography Expertise'],
      fixedTrips: ['Sinai Safari', 'Wadi Rumla', 'Black Desert Experience']
    },
    {
      id: 'guide5',
      name: 'محمد فايز',
      specialty: 'Desert Safaris',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      skills: ['Desert Jeep Driving', 'Multilingual: Arabic & English', 'Astronomy Expertise'],
      fixedTrips: ['Farafra Safari', 'Black Desert', 'Adventure Experience']
    },
    {
      id: 'guide6',
      name: 'كريم ياسر',
      specialty: 'Desert Safaris',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      skills: ['Adventure Planning', 'Multilingual: Arabic & German', 'Bedouin History Expertise'],
      fixedTrips: ['Hurghada Safari', 'Wadi El-Hitan', 'Red Desert Experience']
    }
  ];

  selectedGuide: any = null;

  openSlidePanel(guideId: string) {
    this.selectedGuide = this.tourGuides.find(guide => guide.id === guideId) || null;
  }

  closeSlidePanel() {
    this.selectedGuide = null;
  }
}