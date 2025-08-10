import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Destination, Package } from '../interfaces/package';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { title } from 'process';
import { LoadingDialogComponent } from '../../shared-app/Components/loading-dialog/loading-dialog.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-package',
  imports: [RouterModule, FormsModule, MatProgressSpinner],
  templateUrl: './edit-package.component.html',
  styleUrl: './edit-package.component.scss',
})
export class EditPackageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: CompanyService, private matDialog: MatDialog) { }

  destinations: Destination[] = [];

  photos: File[] = [];

  router = inject(Router);

  toastService = inject(ToastrService);

  ngOnInit(): void {
    this.service.destinations$.subscribe(
      {
        next: (val) => {
          this.destinations = val;
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
    this.route.data.subscribe(
      (complete) => {
        this.packageId = complete['package'];
        this.service.getPackageById(this.packageId).subscribe(
          {

            next: (val) => {
              this.package = val;
              this.package.destinationIds = [];
              this.package.destinationIds = this.package.destinations?.map(d => d.destinationId);
              console.log(this.package.destinationIds);

            },
            error: (err) => {
              let message = '';
              err['error']['errors'].map((e: string) => message += e + '\n');
              this.toastService.error(message, '❌ Error', {
                toastClass: 'ngx-toastr custom-error'
              });

            }
          }
        )
      }
    );
    this.service.getDestinations();
  }

  packageId!: string;

  package!: Package;

  saveData() {
    const formData = new FormData();
    formData.append('PackageName', this.package.packageName);
    formData.append('Description', this.package.description);
    formData.append('Price', this.package.price);
    formData.append('DurationDays', this.package.durationDays.toString());
    formData.append('StartDate', this.package.startDate);
    formData.append('EndDate', this.package.endDate);
    this.package.destinationIds!.map((e) => {
      formData.append('DestinationIds', e.toString());
    });
    this.photos.map((e) => {
      formData.append('Photos', e);
    });
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    this.service.editPackage(formData, this.package.packageId).subscribe({
      next: (value) => {
        ref.close();
        console.log(value);
        this.package = value;
        this.package.destinationIds = [];
        console.log(this.package.destinationIds);

        this.package.destinations?.map(e => {
          this.package.destinationIds?.push(e.destinationId);
        });

        this.service.getPackageById(this.package.packageId).subscribe((e) => {
          this.package.photoUrls = e.photoUrls;
        });
        this.toastService.success('Package Edit Succesfully!', '✅ Success', {
          toastClass: 'ngx-toastr custom-success'
        });
        this.router.navigate(['/company/dashboard']);

        this.photos = [];
      },
      error: (err) => {
        ref.close();
        let message = '';
        this.toastService.error(message, '❌ Error', {
          toastClass: 'ngx-toastr custom-error'
        });
      },
    });
  }

  isDestinationChecked(id: string) {
    return this.package.destinationIds?.includes(id);
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
  }

  removeImage(photo: string) {
    this.package.photoUrls = this.package.photoUrls?.filter((e) => e != photo);
  }

  addToImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files != null && input.files.length > 0) {
      for (let index = 0; index < input.files.length; index++) {
        this.photos.push(input.files[index]);
      }
    }
  }
}
