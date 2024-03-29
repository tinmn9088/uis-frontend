import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { map } from 'rxjs';
import { SelectOption } from 'src/app/shared/domain/select-option';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';

export declare type RoleChangeEvent = {
  userId: number;
  roleId: number;
};

@Component({
  selector: 'app-user-rights-management[user]',
  templateUrl: './user-rights-management.component.html',
  styleUrls: ['./user-rights-management.component.scss'],
})
export class UserRightsManagementComponent implements OnInit {
  roleOptions!: SelectOption[];
  areOptionsLoading = false;
  formGroup!: FormGroup;
  @Input() user!: User;
  @Input() disabled = false;
  @Input() areRolesLoading = false;
  @Output() roleGranted = new EventEmitter<RoleChangeEvent>();
  @Output() roleRevoked = new EventEmitter<RoleChangeEvent>();

  constructor(
    private _roleService: RoleService,
    private _userService: UserService,
    private _snackbarService: SnackbarService,
    private _translate: TranslateService,
    private _errorMessageService: ErrorMessageService
  ) {
    this.formGroup = new FormGroup({
      roleId: new FormControl({ value: '', disabled: this.disabled }),
    });
  }

  ngOnInit() {
    this.updateOptions();
  }

  updateOptions(query?: string | null) {
    this.areOptionsLoading = true;
    this._roleService
      .search(query || '')
      .pipe(
        map(response => response.content),
        map(roles => {
          return roles.map(role => {
            return {
              name: role.name,
              value: role.id,
            } as SelectOption;
          });
        })
      )
      .subscribe(options => {
        this.roleOptions = options;
        this.areOptionsLoading = false;
      });
  }

  onGrantRole() {
    const userId = this.user.id;
    const roleId = this.formGroup.get('roleId')?.value;
    if (!roleId) return;

    this._userService.grantRole(userId, roleId).subscribe({
      next: () => {
        this.roleGranted.emit({ userId, roleId });
        this._translate
          .get('users.user_rights_management.role_granted_message')
          .subscribe(message => {
            this._snackbarService.showSuccess(message);
          });
      },
      error: (response: HttpErrorResponse) => {
        this._translate
          .get('users.user_rights_management.role_change_error_message')
          .subscribe(message => {
            this._snackbarService.showError(
              this._errorMessageService.buildHttpErrorMessage(response, message)
            );
          });
      },
    });
  }

  onRevokeRole(roleId: number) {
    const userId = this.user.id;
    this._userService.revokeRole(userId, roleId).subscribe({
      next: () => {
        this.roleRevoked.emit({ userId, roleId });
        this._translate
          .get('users.user_rights_management.role_revoked_message')
          .subscribe(message => {
            this._snackbarService.showSuccess(message);
          });
      },
      error: (response: HttpErrorResponse) => {
        this._translate
          .get('users.user_rights_management.role_change_error_message')
          .subscribe(message => {
            this._snackbarService.showError(
              this._errorMessageService.buildHttpErrorMessage(response, message)
            );
          });
      },
    });
  }
}
