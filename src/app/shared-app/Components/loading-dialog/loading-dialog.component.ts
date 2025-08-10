import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-dialog-component',
  templateUrl: 'loading-dialog.component.html',
  styleUrl: 'loading-dialog.component.scss',
  standalone: true,
  imports: [MatProgressSpinner],
})
export class LoadingDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<LoadingDialogComponent>) { }
  get title() { return this.data.title; }
  get message() { return this.data.message; }
  get method() { return this.data.method; }

  close() {
    this.ref.close();
    this.method();
  }
}
