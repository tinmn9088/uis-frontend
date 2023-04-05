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
          this.navigateToAuthPage(url);
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
  private navigateToAuthPage(url: string) {
    this._router.navigate(this._authService.AUTH_PAGE_PATH, {
      queryParams: { redirectTo: url },
    });
  }
}
