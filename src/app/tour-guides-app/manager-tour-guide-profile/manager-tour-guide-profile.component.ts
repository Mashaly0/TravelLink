import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TourGuide } from './../interfaces/tour-guide';
import { TourGuideService } from './../tour-guide.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-tour-guide-profile',
  imports: [FormsModule, MatProgressSpinner, RouterLink],
  standalone: true,
  templateUrl: './manager-tour-guide-profile.component.html',
  styleUrl: './manager-tour-guide-profile.component.scss'
})
export class ManagerTourGuideProfileComponent implements OnInit {

  service = inject(TourGuideService);
  constructor(private route: ActivatedRoute, private matDialog: MatDialog) { }

  allLanguages = ['Arabic', 'English', 'French', 'German', 'Russian', 'Spanish', 'Chinese', 'Japanese'];

  myLanguages: string[] = [];

  allDestinations: string[] = [];

  myDestinations: string[] = [];

  photos: File[] = [
  ];

  isGuideReqFinished = false;

  router = inject(Router);


  toastService = inject(ToastrService);


  ngOnInit(): void {
    this.service.getDestinations().subscribe(
      {
        next: (value) => {
          this.allDestinations = value.map((e) => e.name);
          this.isGuideReqFinished = true;
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });

        },
      }
    );
    this.service.dashboard$.subscribe(
      {
        next: (value) => {
          this.tourGuide = value.tourGuide!;
          this.myLanguages = this.tourGuide.languages!.split(',');
          if (this.allDestinations.length > 0) {
            this.myDestinations = this.tourGuide!.areasCovered!.split(',');
          }
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
    this.service.getTourGuideDashBoard();
  }

  tourGuide!: TourGuide;

  editProfile() {
    const formData = this.toFormData(this.tourGuide);
    this.photos.map(
      (e) => {
        formData.append('Photos', e);
      }
    );
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    this.service.editTourGuide(formData).subscribe(
      {

        next: (value) => {
          ref.close();
          this.tourGuide = value;
          this.photos = [];
          this.toastService.success('Profile Edit Succesfully!', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });
          this.router.navigate(['/tour-guide/dashboard'])
        },
        error: (err) => {
          ref.close();
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.toastService.error(message, '❌ Error', {
            toastClass: 'ngx-toastr custom-error'
          });
        },
      }
    );
  }

  editLanguages(item: string) {
    if (this.myLanguages.includes(item)) {
      this.myLanguages = this.myLanguages.filter((x) => x != item);
    } else {
      this.myLanguages.push(item);
    }
    this.tourGuide.languages = this.myLanguages.join(',');
  }
  editDestination(item: string) {
    if (this.myDestinations.includes(item)) {
      this.myDestinations = this.myDestinations.filter((x) => x != item);
    } else {
      this.myDestinations.push(item);
    }
    this.tourGuide.areasCovered = this.myDestinations.join(',');
  }

  toFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }

  addPhotosToForm(event: Event) {
    this.photos = [];
    const input = event.target as HTMLInputElement;
    if (input.files != null && input.files.length > 0) {
      for (let index = 0; index < input.files.length; index++) {
        this.photos.push(input.files[index]);
      }
    }
    console.log('number of photos : ' + this.photos.length);
  }

}
