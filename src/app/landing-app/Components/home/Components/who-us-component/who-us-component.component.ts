import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-who-us-component',
  imports: [CommonModule],
  templateUrl: './who-us-component.component.html',
  styleUrl: './who-us-component.component.scss'
})
export class WhoUsComponentComponent {
features = [
    {
      icon: 'fas fa-map-marked-alt',
      title: 'Exclusive Access',
      description: 'Special itineraries and locations only available through our partnerships'
    },
    {
      icon: 'fas fa-hotel',
      title: 'Preferred Hotels',
      description: 'Contract rates at 50+ premium hotels and Nile cruises across Egypt'
    },
    {
      icon: 'fas fa-user-tie',
      title: 'Expert Guides',
      description: 'Our hand-picked Egyptologists with special access to historical sites'
    },
    {
      icon: 'fas fa-gem',
      title: 'Unique Experiences',
      description: 'Private tomb openings, archaeological site visits, and cultural encounters'
    }
]

 // Static data for partners
  partners = [
    { src: 'assets/images/partner1.png', alt: 'Partner 1' },
    { src: 'assets/images/partner2.png', alt: 'Partner 2' },
    { src: 'assets/images/partner3.png', alt: 'Partner 3' },
    { src: 'assets/images/partner4.png', alt: 'Partner 4' }
  ];
}
