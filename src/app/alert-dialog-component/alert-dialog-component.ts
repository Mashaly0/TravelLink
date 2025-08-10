import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-alert-dialog-component',
    imports: [MatDialogActions],
    templateUrl: 'alert-dialog-component.html',
    styleUrl: 'alert-dialog-component.scss',
})
export class AlertDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AlertDialogComponent>) { }
    get title() { return this.data.title; }
    get message() { return this.data.message; }
    get method() { return this.data.method; }

    close() {
        this.ref.close();
        this.method();
    }
}
