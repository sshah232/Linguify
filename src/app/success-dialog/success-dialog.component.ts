import { Component } from '@angular/core';

@Component({
  selector: 'app-success-dialog',
  template: `
    <h1 mat-dialog-title>Form Submitted</h1>
    <div mat-dialog-content>
      <p>Form submitted successfully</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `,
})
export class SuccessDialogComponent {}
