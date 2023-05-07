import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JWT_HELPER_SERVICE_TOKEN } from '../auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * - Checks if there is authorization data.
 * - Refreshes JWT if needed.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _translateService: TranslateService,
    @Inject(JWT_HELPER_SERVICE_TOKEN)
    private _jwtHelperService: JwtHelperService,
    private _router: Router
  ) {}

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isAuthValid(state.url);
  }

  canActivateChild(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isAuthValid(state.url);
  }

  /**
   * @param url current url
   */
  private isAuthValid(url: string): Observable<boolean> {
    console.debug('AuthGuard working.');

    const auth = this._authService.auth;

    if (!auth) {
      console.debug('No authorization data found.');
      this.navigateToAuthPage(url);
      return of(false);
    }

    const accessToken = auth.accessToken;
    const refreshToken = auth.refreshToken;

    let isTokenExpired = true;

    try {
      isTokenExpired = this._jwtHelperService.isTokenExpired(accessToken);
    } catch (error) {
      console.error(error);
    }

    if (isTokenExpired) {
      console.debug('Access JWT is expired. Try to refresh ...');
      return this._authService.refresh({ refreshToken }).pipe(
        catchError(() => {
          this.navigateToAuthPage(url, true);
          return of(false);
        }),
        map(() => true)
      );
    }

    return of(true);
  }

  /**
   * @param url current url
   */
  private navigateToAuthPage(url: string, sessionExpired = false) {
    this._translateService
      .get(
        sessionExpired ? 'auth.session_expired' : 'auth.authentication_needed'
      )
      .subscribe(message => {
        this._snackbarService.showInfo(message);
      });
    this._authService.logout();
    this._router.navigate(this._authService.AUTH_PAGE_PATH, {
      queryParams: { redirectTo: url },
    });
  }
}
