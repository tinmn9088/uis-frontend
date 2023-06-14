import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoleFormDialogComponent } from '../role-form-dialog/role-form-dialog.component';
import { RolePageableResponse } from '../../domain/role-pageable-response';
import { Role } from '../../domain/role';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { PermissionScope } from '../../domain/permission-scope';
import { BehaviorSubject } from 'rxjs';
import { PermissionAction } from '../../domain/permission-action';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';

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
  displayedColumns: string[] = ['id', 'name', 'permissions'];
  isLoading = true;
  dataSource: Role[] = [];
  permissionsByRoleId = new Map<number, BehaviorSubject<PermissionScope[]>>();
  availablePermissions!: PermissionScope[];
  canUserCreateRole: boolean;
  canUserModifyRole: boolean;
  allPermissionScopesAreLoaded = new BehaviorSubject<boolean>(false);

  constructor(
    private _roleService: RoleService,
    private _permissionService: PermissionService,
    private _authService: AuthService,
    private _matDialog: MatDialog
  ) {
    this.canUserCreateRole = this._authService.hasUserPermissions([
      Permission.ROLE_CREATE,
    ]);
    this.canUserModifyRole = this._authService.hasUserPermissions([
      Permission.ROLE_UPDATE,
    ]);
    if (this.canUserCreateRole || this.canUserModifyRole) {
      this.displayedColumns.push('operations');
    }
  }

  ngOnInit() {
    this.search();
    this._permissionService.getAllScopes().subscribe(scopes => {
      this.availablePermissions = scopes;
      this.allPermissionScopesAreLoaded.next(true);
    });
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

  getRolePermissions(role: Role): BehaviorSubject<PermissionScope[]> {
    if (this.permissionsByRoleId.has(role.id)) {
      return this.permissionsByRoleId.get(role.id) as BehaviorSubject<
        PermissionScope[]
      >;
    } else {
      const permissions = new BehaviorSubject<PermissionScope[]>([]);
      this.permissionsByRoleId.set(role.id, permissions);
      setTimeout(() => {
        const subscribtion = this.allPermissionScopesAreLoaded.subscribe(
          areLoaded => {
            if (areLoaded) {
              permissions.next(this.filterPermissionsByIds(role.permissionIds));
              setTimeout(() => subscribtion.unsubscribe());
            }
          }
        );
      });
      return permissions;
    }
  }

  getPermissionActionsNames(actions: PermissionAction[]): string[] {
    return actions.map(action => action.name);
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

  private filterPermissionsByIds(permissionIds: number[]): PermissionScope[] {
    const scopes: PermissionScope[] = [];
    this.availablePermissions.forEach(scope => {
      const filteredActions = scope.actions.filter(action =>
        permissionIds.includes(action.id)
      );
      if (filteredActions.length > 0) {
        scopes.push({ scope: scope.scope, actions: filteredActions });
      }
    });
    return scopes;
  }
}
