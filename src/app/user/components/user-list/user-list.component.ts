import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserTableComponent } from '../user-table/user-table.component';
import { UserPageableResponse } from '../../domain/user-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserCreateDialogComponent } from '../user-create-dialog/user-create-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  private _dialogRef?: MatDialogRef<UserCreateDialogComponent, unknown>;
  formGroup!: FormGroup;
  @ViewChild(UserTableComponent)
  userTable!: UserTableComponent;
  totalElements!: number;
  pageSize = 16;
  pageNumber!: number;

  constructor(private _matDialog: MatDialog) {
    this.formGroup = new FormGroup({
      searchQuery: new FormControl(''),
    });
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  set searchQuery(value: string) {
    this.formGroup.get('searchQuery')?.setValue(value);
  }

  onSearch() {
    this.userTable.search(this.searchQuery);
  }

  onDataUpdate(response: UserPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.userTable.search(this.searchQuery);
  }

  onSortChange() {
    this.userTable.search(this.searchQuery);
  }

  openUserCreateDialog() {
    this._dialogRef = this._matDialog.open(UserCreateDialogComponent);
    this._dialogRef.afterClosed().subscribe(() => {
      this.searchQuery = '';
      this.userTable.search();
    });
  }
}
