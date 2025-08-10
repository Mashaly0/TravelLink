import { Package } from './../interfaces/package';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { Destination } from '../interfaces/package';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { title } from 'process';
import { Router, RouterLink } from '@angular/router';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-package',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-package.component.html',
  styleUrl: './create-package.component.scss'
})
export class CreatePackageComponent implements OnInit {
  removeImage(index: number) {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
    if (this.photoPreviews.length === 0) {
      this.fileInput.nativeElement.value = '';
    }

  }

  constructor(private service: CompanyService, private matDialog: MatDialog) { }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  destinations: Destination[] = [];

  photos: File[] = [
  ];

  photoPreviews: string[] = [];

  package: Package = {
    packageId: '1',
    companyId: 'e252c219-635c-4d18-bbf9-5c1573c94a77',
    packageName: '',
    description: '',
    price: '',
    durationDays: 0,
    startDate: '',
    endDate: '',
    companyName: '',
    destinationIds: [],
  };

  router = inject(Router);

  toastService = inject(ToastrService);


  ngOnInit(): void {
    this.service.destinations$.subscribe({
      next: (value) => {
        this.destinations = value;
      },
      error: (err) => {
        let message = '';
        this.toastService.error(message, '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
      },
    });
    this.service.getDestinations();
  }

  createPackage() {
    this.package.durationDays = this.calculateDaysDifference(this.package.startDate, this.package.endDate);
    const formData = this.toFormData(this.package);
    this.photos.map((e) => formData.append('Photos', e));
    this.package.destinationIds!.map((e) => formData.append('DestinationIds', e.toString()));
    formData.delete('destinationIds');

    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });

    this.service.createPackage(formData).subscribe(
      {

        next: (val) => {
          ref.close();
          this.toastService.success('Package Created Successfully!', '✅ Success', {
            toastClass: 'ngx-toastr custom-success'
          });
        },
        error: (error) => {
          ref.close();
          let message = '';
          console.log(error.errors);
        }
      }
    );
  }

  calculateDaysDifference(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / millisecondsPerDay);

    return diffInDays;
  }

  addOrRemoveDestination(id: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.package.destinationIds?.includes(id)) {
        this.package.destinationIds?.push(id);
      }
    } else {
      this.package.destinationIds = this.package.destinationIds?.filter(destId => destId !== id);
    }
    console.log('des changes : ' + this.package.destinationIds);

  }

  addImagesToPackage(event: Event) {
    this.photos = [];
    const input = event.target as HTMLInputElement;
    if (input.files != null && input.files.length > 0) {
      for (let index = 0; index < input.files.length; index++) {
        this.photos.push(input.files[index]);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          this.photoPreviews.push(result);
        };
        reader.readAsDataURL(input.files[index]);
      }
    }
    console.log('number of photos : ' + this.photos.length);
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
}
