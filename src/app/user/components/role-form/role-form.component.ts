import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { Role } from '../../domain/role';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Permission } from 'src/app/auth/domain/permission';
import {
  map,
  distinctUntilChanged,
  delay,
  BehaviorSubject,
  filter,
} from 'rxjs';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';
import { RoleCreateRequest } from '../../domain/role-create-request';
import { RoleUpdateRequest } from '../../domain/role-update-request';
import { PermissionScope } from '../../domain/permission-scope';
import { MatSelectionList } from '@angular/material/list';
import { PermissionAction } from '../../domain/permission-action';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit, AfterViewInit {
  private _hiddenPermissionActions = new Set<PermissionAction>();
  private _hiddenPermissionScopes = new Set<PermissionScope>();
  formGroup!: FormGroup;
  editMode!: boolean;
  copyMode!: boolean;
  canUserCreateRole: boolean;
  canUserModifyRole: boolean;
  permissionScopes?: PermissionScope[];
  arePermissionScopesLoading = false;
  areAllPermissionsSelected!: boolean;
  areSomePermissionsSelected!: boolean;
  arePermissionsLoaded!: BehaviorSubject<boolean>; // must send `true` at least once
  @ViewChild(MatSelectionList) matSelectionList?: MatSelectionList;
  @Input() role?: Role;
  @Output() roleCreatedUpdated = new EventEmitter<Role>();
  @Output() formInvalid = new EventEmitter<boolean>();

  constructor(
    private _roleService: RoleService,
    private _permissionService: PermissionService,
    private _authService: AuthService,
    private _translate: TranslateService,
    private _snackbarService: SnackbarService,
    private _errorMessageService: ErrorMessageService
  ) {
    this.canUserCreateRole = this._authService.hasUserPermissions([
      Permission.ROLE_CREATE,
    ]);
    this.canUserModifyRole = this._authService.hasUserPermissions([
      Permission.ROLE_UPDATE,
    ]);
  }

  ngOnInit() {
    this.editMode = !!this.role && !!this.role.id;
    this.copyMode = !!this.role && !this.role.id;
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    this.formGroup.valueChanges
      .pipe(
        map(() => this.formGroup.invalid),
        distinctUntilChanged()
      )
      .subscribe(invalid => {
        this.formInvalid.emit(invalid);
      });
    this.arePermissionScopesLoading = true;
    this.arePermissionsLoaded = new BehaviorSubject<boolean>(false);
    this._permissionService.getAllScopes().subscribe({
      next: scopes => {
        this.permissionScopes = scopes;

        // scopes are collapsed at the start
        this.permissionScopes.forEach(scope => this.hidePermissionScope(scope));

        this.arePermissionScopesLoading = false;
        setTimeout(() => {
          this.arePermissionsLoaded.next(true);
          this.arePermissionsLoaded.complete();
        });
      },
      error: error => {
        console.error(error);
      },
    });

    // to emit valueChanges event
    const name =
      this.role && this.copyMode
        ? `${this.role.name} Copy`
        : this.role && this.editMode
        ? this.role.name
        : undefined;
    this.formGroup.patchValue({ name }, { emitEvent: true });
  }

  ngAfterViewInit() {
    if (!this.arePermissionsLoaded.value) {
      this.arePermissionsLoaded
        .pipe(filter(areLoaded => areLoaded))
        .subscribe(() => {
          this.initPermissionsSelectionListValues();
        });
    } else {
      this.initPermissionsSelectionListValues();
    }
  }

  get name() {
    return this.formGroup.get('name')?.value;
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.formGroup.disable();
    const requestBody: RoleCreateRequest | RoleUpdateRequest = {
      name: this.name,
      permissionIds:
        this.matSelectionList?.selectedOptions.selected.map(
          option => option.value
        ) || [],
    };

    const request$ =
      this.editMode && this.role
        ? this._roleService.update(this.role?.id, requestBody)
        : this._roleService.create(requestBody);

    request$.subscribe({
      next: role => {
        this._translate
          .get(
            this.editMode
              ? 'users.roles.form.snackbar_update_success_message'
              : 'users.roles.form.snackbar_create_success_message'
          )
          .pipe(delay(666))
          .subscribe(message => {
            this.roleCreatedUpdated.emit(role);
            this._snackbarService.showSuccess(message, SnackbarAction.Cross);
          });
      },
      error: (response: HttpErrorResponse) => {
        this._translate
          .get(
            this.editMode
              ? 'users.roles.form.snackbar_update_fail_message'
              : 'users.roles.form.snackbar_create_fail_message'
          )
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(
              this._errorMessageService.buildHttpErrorMessage(
                response,
                message
              ),
              SnackbarAction.Cross
            );
          });
      },
    });
  }

  selectAllPermissions(doSelect: boolean) {
    if (this.matSelectionList) {
      if (doSelect) {
        this.matSelectionList.selectAll();
      } else {
        this.matSelectionList.deselectAll();
      }
    }
  }

  hidePermissionScope(scope: PermissionScope) {
    this.hidePermissionActions(scope.actions);
    this._hiddenPermissionScopes.add(scope);
  }

  unhidePermissionScope(scope: PermissionScope) {
    this.unhidePermissionActions(scope.actions);
    this._hiddenPermissionScopes.delete(scope);
  }

  isPermissionScopeHidden(scope: PermissionScope): boolean {
    return this._hiddenPermissionScopes.has(scope);
  }

  isPermissionActionHidden(action: PermissionAction): boolean {
    return this._hiddenPermissionActions.has(action);
  }

  private hidePermissionActions(permissionsToHide: PermissionAction[]) {
    permissionsToHide.forEach(permissionToHide =>
      this._hiddenPermissionActions.add(permissionToHide)
    );
  }

  private unhidePermissionActions(actionsToUnhide: PermissionAction[]) {
    actionsToUnhide.forEach(actionToUnhide =>
      this._hiddenPermissionActions.delete(actionToUnhide)
    );
  }

  private checkAreAllPermissionsSelected(): boolean {
    return (
      !!this.matSelectionList &&
      this.matSelectionList.selectedOptions.selected.length ===
        this.matSelectionList.options.length
    );
  }

  private checkAreSomePermissionsSelected(): boolean {
    const selectedCount =
      this.matSelectionList?.selectedOptions.selected.length || 0;
    const optionsCount = this.matSelectionList?.options.length || 0;
    return (
      !!this.matSelectionList &&
      selectedCount > 0 &&
      selectedCount < optionsCount
    );
  }

  private initPermissionsSelectionListValues() {
    this.areAllPermissionsSelected = this.checkAreAllPermissionsSelected();
    this.areSomePermissionsSelected = this.checkAreSomePermissionsSelected();
    this.matSelectionList?.selectionChange.subscribe(() => {
      this.areAllPermissionsSelected = this.checkAreAllPermissionsSelected();
      this.areSomePermissionsSelected = this.checkAreSomePermissionsSelected();
    });
  }
}
