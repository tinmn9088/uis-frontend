import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoleFormDialogComponent } from '../role-form-dialog/role-form-dialog.component';
import { RolePageableResponse } from '../../domain/role-pageable-response';
import { Role } from '../../domain/role';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
})
export class RoleTableComponent implements OnInit {
  private _dialogRef?: MatDialogRef<RoleFormDialogComponent, unknown>;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<RolePageableResponse>();
  displayedColumns: string[] = ['id', 'name', 'permissionIds', 'operations'];
  isLoading = true;
  dataSource: Role[] = [];

  constructor(
    private _roleService: RoleService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.search();
  }

  search(searchQuery?: string) {
    this.isLoading = true;
    this.dataSource = [];
    this._roleService
      .search(searchQuery || '', this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }

  openRoleEditDialog(role: Role, copyRole = false) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...roleWithoutId } = role;
    this._dialogRef = this._matDialog.open(RoleFormDialogComponent, {
      data: { role: copyRole ? roleWithoutId : role },
    });
    this._dialogRef.afterClosed().subscribe(() => {
      this.search();
    });
  }
}
