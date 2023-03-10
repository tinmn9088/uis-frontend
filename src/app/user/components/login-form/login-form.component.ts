import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { delay, distinctUntilChanged } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, AfterViewInit {
  private readonly _breakpoint$ = this._breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
    .pipe(distinctUntilChanged());
  cardWidthPercents = 66;
  passwordHidden = true;

  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _router: Router,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this._breakpoint$.subscribe(() => this.onBreakpointChange());
  }

  ngAfterViewInit() {
    setTimeout(() => this.onBreakpointChange(), 0);
  }

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
    this._authService.login(loginRequest).subscribe({
      next: () => {
        this._translate
          .get('users.login_form.messages.success')
          .pipe(delay(666))
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showSuccess(message, SnackbarAction.Cross);
            this._router.navigateByUrl('/user/list');
          });
      },
      error: () => {
        this._translate
          .get('users.login_form.messages.error')
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(message, SnackbarAction.Cross);
          });
      },
    });
  }

  private onBreakpointChange() {
    const isSmall = this._breakpointObserver.isMatched(Breakpoints.Small);
    const isMedium = this._breakpointObserver.isMatched(Breakpoints.Medium);
    const isLarge = this._breakpointObserver.isMatched(Breakpoints.Large);

    if (isSmall) {
      this.cardWidthPercents = 80;
    }
    if (isMedium) {
      this.cardWidthPercents = 66;
    }
    if (isLarge) {
      this.cardWidthPercents = 33;
    }
  }
}
