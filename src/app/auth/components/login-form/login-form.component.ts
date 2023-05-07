import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { delay, distinctUntilChanged } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarAction } from 'src/app/shared/domain/snackbar-action';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  private readonly _breakpoint$ = this._breakpointObserver
    .observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(distinctUntilChanged());
  cardWidthPercents = 66;
  passwordHidden = true;
  isUserLoggedIn!: boolean;
  currentUsername?: string;
  redirectTo?: string;

  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this._breakpoint$.subscribe(() => this.onBreakpointChange());
    this.redirectTo = this._activatedRoute.snapshot.queryParams['redirectTo'];
    if (this.redirectTo) {
      console.debug(`Will redirect back to: "${this.redirectTo}"`);
    }
    this.isUserLoggedIn = this.checkIsUserLoggedIn();
    if (this.isUserLoggedIn) {
      this.currentUsername = this._authService.user.username;
      this._translate
        .get('auth.login_form.messages.logged_in_already_username')
        .subscribe(message => {
          this._snackbarService.showInfo(`${message} ${this.currentUsername}`);
        });
    }
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
          .get('auth.login_form.messages.success')
          .pipe(delay(666))
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showSuccess(message, SnackbarAction.Cross);
            this._router.navigateByUrl(this.redirectTo || '/');
          });
      },
      error: (error: HttpErrorResponse) => {
        this._translate
          .get(
            error.status === HttpStatusCode.NotFound
              ? 'auth.login_form.messages.invalid_request_error'
              : 'auth.login_form.messages.server_error'
          )
          .subscribe(message => {
            this.formGroup.enable();
            this._snackbarService.showError(message, SnackbarAction.Cross);
          });
      },
    });
  }

  logout() {
    this._authService.logout();
    this.isUserLoggedIn = this.checkIsUserLoggedIn();
    this._translate
      .get('auth.login_form.messages.logged_out')
      .subscribe(messsage => {
        this._snackbarService.showInfo(messsage);
      });
  }

  private checkIsUserLoggedIn(): boolean {
    return !!this._authService.auth && !!this._authService.user;
  }

  private onBreakpointChange() {
    const isSmall = this._breakpointObserver.isMatched(Breakpoints.Small);
    const isMedium = this._breakpointObserver.isMatched(Breakpoints.Medium);
    const isLarge = this._breakpointObserver.isMatched([
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]);

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
