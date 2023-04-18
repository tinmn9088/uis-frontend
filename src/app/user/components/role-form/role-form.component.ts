import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { Role } from '../../domain/role';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Permission } from 'src/app/auth/domain/permission';
import { map, distinctUntilChanged, delay } from 'rxjs';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';
import { RoleCreateRequest } from '../../domain/role-create-request';
import { RoleUpdateRequest } from '../../domain/role-update-request';
import { PermissionScope } from '../../domain/permission-scope';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  formGroup!: FormGroup;
  areNotPermissionsPresent: boolean;
  editMode!: boolean;
  passwordHidden = true;
  permissionScopes?: PermissionScope[];
  arePermissionScopesLoading = false;
  @ViewChild(MatSelectionList) matSelectionList?: MatSelectionList;
  @Input() role?: Role;
  @Output() roleCreatedUpdated = new EventEmitter<Role>();
  @Output() formInvalid = new EventEmitter<boolean>();

  constructor(
    private _roleService: RoleService,
    private _permissionService: PermissionService,
    private _authService: AuthService,
    private _translate: TranslateService,
    private _snackbarService: SnackbarService
  ) {
    this.areNotPermissionsPresent = !this._authService.hasUserPermissions([
      Permission.ROLE_CREATE,
      Permission.PERMISSION_GET,
    ]);
  }

  ngOnInit() {
    this.editMode = !!this.role;
    this.formGroup = new FormGroup({
      name: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),
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
    this._permissionService.getAllScopes().subscribe(scopes => {
      this.permissionScopes = scopes;
      this.arePermissionScopesLoading = false;
    });

    // to emit valueChanges event
    this.formGroup.patchValue({ name: this.role?.name }, { emitEvent: true });
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
      error: () => {
        this._translate
          .get(
            this.editMode
              ? 'users.roles.form.snackbar_update_fail_message'
              : 'users.roles.form.snackbar_create_fail_message'
          )
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(message, SnackbarAction.Cross);
          });
      },
    });
  }
}
