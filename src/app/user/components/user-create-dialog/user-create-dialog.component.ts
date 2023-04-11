import { Component, ViewChild } from '@angular/core';
import { UserCreateFormComponent } from '../user-create-form/user-create-form.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-create-dialog',
  templateUrl: './user-create-dialog.component.html',
  styleUrls: ['./user-create-dialog.component.scss'],
})
export class UserCreateDialogComponent {
  isFormInvalid = true;
  @ViewChild(UserCreateFormComponent) userCreateForm!: UserCreateFormComponent;

  constructor(private _dialogRef: MatDialogRef<UserCreateFormComponent>) {}

  onCreateButtonClicked() {
    this.userCreateForm.submit();
  }

  onCreated() {
    this._dialogRef.close();
  }
}
