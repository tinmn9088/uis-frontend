import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Permission } from 'src/app/auth/domain/permission';
import { delay, distinctUntilChanged, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';
import { User } from '../../domain/user';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-create-form',
  templateUrl: './user-create-form.component.html',
  styleUrls: ['./user-create-form.component.scss'],
})
export class UserCreateFormComponent {
  formGroup!: FormGroup;
  areNotPermissionsPresent: boolean;
  passwordHidden = true;
  @Output() userCreated = new EventEmitter<User>();
  @Output() formInvalid = new EventEmitter<boolean>();

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _translate: TranslateService,
    private _snackbarService: SnackbarService,
    private _errorMessageService: ErrorMessageService
  ) {
    this.areNotPermissionsPresent = !this._authService.hasUserPermissions([
      Permission.USER_CREATE,
    ]);

    this.formGroup = new FormGroup({
      username: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        Validators.required
      ),

      /**
       * Password must be 8 or more characters in length.
       * Password must contain 1 or more uppercase characters.
       * Password must contain 1 or more digit characters.
       * Password must contain 1 or more special characters.
       */
      password: new FormControl(
        { value: '', disabled: this.areNotPermissionsPresent },
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/([A-Z])/),
          Validators.pattern(/([0-9])/),
          Validators.pattern(/([!@#$%^&*])/),
        ]
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
  }

  get username() {
    return this.formGroup.get('username')?.value;
  }

  get password() {
    return this.formGroup.get('password')?.value;
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.formGroup.disable();
    const userCreateRequest = {
      username: this.username,
      password: this.password,
    };
    this._userService.create(userCreateRequest).subscribe({
      next: user => {
        this._translate
          .get('users.user_create_form.messages.success')
          .pipe(delay(666))
          .subscribe(message => {
            this.userCreated.emit(user);
            this._snackbarService.showSuccess(message, SnackbarAction.Cross);
          });
      },
      error: (response: HttpErrorResponse) => {
        this._translate
          .get('users.user_create_form.messages.error')
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
}
