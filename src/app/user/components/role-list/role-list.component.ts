import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoleFormDialogComponent } from '../role-form-dialog/role-form-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RoleTableComponent } from '../role-table/role-table.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { RolePageableResponse } from '../../domain/role-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsService } from 'src/app/shared/services/query-params.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  private _dialogRef?: MatDialogRef<RoleFormDialogComponent, unknown>;
  formGroup!: FormGroup;
  @ViewChild(RoleTableComponent)
  roleTable!: RoleTableComponent;
  totalElements!: number;
  pageSize!: number;
  pageNumber!: number;
  arePermissionsPresent: boolean;
  canUserCreateRole: boolean;

  constructor(
    private _matDialog: MatDialog,
    private _authService: AuthService,
    private _queryParamsService: QueryParamsService,
    private _route: ActivatedRoute
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.ROLE_READ,
    ]);
    this.canUserCreateRole = this._authService.hasUserPermissions([
      Permission.ROLE_CREATE,
    ]);

    this.formGroup = new FormGroup({
      searchQuery: new FormControl({
        value: '',
        disabled: !this.arePermissionsPresent,
      }),
    });
  }

  ngOnInit() {
    if (this.arePermissionsPresent) {
      this._route.data.subscribe(({ searchQuery, pagination }) => {
        this.formGroup.setValue({ searchQuery }, { emitEvent: false });
        this.pageNumber = pagination.page;
        this.pageSize = pagination.size;
        setTimeout(() => this.roleTable.search(this.searchQuery));
      });
    }
  }

  get searchQuery(): string {
    return this.formGroup.get('searchQuery')?.value;
  }

  set searchQuery(value: string) {
    this.formGroup.get('searchQuery')?.setValue(value);
  }

  onSearch() {
    this.pageNumber = 0;
    this._queryParamsService.appendQueryParams(
      this._route,
      this._queryParamsService.mergeParams(
        this._queryParamsService.generatePaginationParam(
          this.pageSize,
          this.pageNumber
        ),
        this._queryParamsService.generateSearchQueryParam(this.searchQuery)
      )
    );
    this.roleTable.search(this.searchQuery);
  }

  onDataUpdate(response: RolePageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.roleTable.search(this.searchQuery);
  }

  onSortChange() {
    this.roleTable.search(this.searchQuery);
  }

  openRoleFormDialog() {
    this._dialogRef = this._matDialog.open(RoleFormDialogComponent, {
      data: { role: undefined },
    });
    this._dialogRef.afterClosed().subscribe(() => {
      this.searchQuery = '';
      this.roleTable?.search();
    });
  }
}
