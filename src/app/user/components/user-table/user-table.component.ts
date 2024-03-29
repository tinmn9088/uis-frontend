import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserPageableResponse } from '../../domain/user-pageable-response';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../domain/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  private _dialogRef?: MatDialogRef<UserEditDialogComponent, unknown>;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<UserPageableResponse>();
  displayedColumns: string[] = [
    'username',
    'roles',
    'lastActivity',
    'creationTime',
    'operations',
  ];
  isLoading = true;
  dataSource: User[] = [];
  canUserModifyUser: boolean;

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _matDialog: MatDialog
  ) {
    this.canUserModifyUser = this._authService.hasUserPermissions([
      Permission.USER_MANAGE_ROLES,
    ]);
  }

  ngOnInit() {
    this.search();
  }

  search(searchQuery?: string) {
    this.isLoading = true;
    this.dataSource = [];
    this._userService
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

  getUserRolesNames(user: User): string[] | undefined {
    return user.roles.map(role => role.name);
  }

  openUserEditDialog(user: User) {
    this._dialogRef = this._matDialog.open(UserEditDialogComponent, {
      data: { user },
    });
    this._dialogRef.afterClosed().subscribe(() => {
      if (this._authService.user.id === user.id) {
        this._authService
          .refresh({
            refreshToken: this._authService.auth.refreshToken,
          })
          .subscribe(() =>
            console.debug('Information about current user refreshed')
          );
      }
      this.search();
    });
  }
}
