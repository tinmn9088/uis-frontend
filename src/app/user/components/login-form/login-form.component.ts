import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  passwordHidden = true;

  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private _userService: UserService,
    private _snackbarService: SnackbarService,
    private _router: Router,
    private _translate: TranslateService
  ) {}

  get username() {
    return this.formGroup.get('username')?.value;
  }

  get password() {
    return this.formGroup.get('password')?.value;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.formGroup.disable();
    const loginRequest = { username: this.username, password: this.password };
    this._userService.login(loginRequest).subscribe({
      next: () => {
        this._translate
          .get('user.login_form.messages.success')
          .pipe(delay(666))
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showSuccess(message, '✕');
            //this._router.navigateByUrl('/')
          });
      },
      error: () => {
        this._translate
          .get('user.login_form.messages.error')
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(message, '✕');
          });
      },
    });
  }
}
