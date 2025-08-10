import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HotelsService } from '../../hotels-service.service';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { Room } from '../../interfaces/hotel-dashboard';
import { MatDialog } from '@angular/material/dialog';
import { DeletePackageComponent } from '../delete-package/delete-package.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rooms-table',
  imports: [RouterLink, CommonModule],
  templateUrl: './rooms-table.component.html',
  styleUrl: './rooms-table.component.scss'
})
export class RoomsTableComponent {
  constructor(private matDialog: MatDialog) { }


  rooms: Room[] = [];

  toastService = inject(ToastrService);

  ngOnInit(): void {
    this.service.roomsDashBoard$.subscribe(
      {
        next: (value) => {
          this.rooms = value;
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
    this.service.getHotelDashBoard();
  }
  service = inject(HotelsService);


  openDeleteDialog(packageId: string, itemName: string): void {
    this.matDialog.open(DeletePackageComponent, {
      data: { id: packageId, itemName: itemName }
    });
  }
}