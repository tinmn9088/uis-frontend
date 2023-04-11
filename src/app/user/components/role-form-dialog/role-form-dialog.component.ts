import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleFormComponent } from '../role-form/role-form.component';
import { Role } from '../../domain/role';

@Component({
  selector: 'app-role-form-dialog',
  templateUrl: './role-form-dialog.component.html',
  styleUrls: ['./role-form-dialog.component.scss'],
})
export class RoleFormDialogComponent {
  isFormInvalid = true;
  @ViewChild(RoleFormComponent) roleForm!: RoleFormComponent;

  constructor(
    private _dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role?: Role }
  ) {}

  onCreateUpdateButtonClicked() {
    this.roleForm.submit();
  }

  onCreatedUpdated() {
    this._dialogRef.close();
  }
}
