import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpStatusCode,
} from '@angular/common/http';
import {
  Observable,
  catchError,
  throwError,
  mergeMap,
  BehaviorSubject,
  finalize,
  EMPTY,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Auth } from '../domain/auth';
import { Router } from '@angular/router';
import { REFRESH_JWT_REQUEST_COUNT_TOKEN } from 'src/app/shared/shared.module';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Puts `Authorization` header with JWT in each request.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static readonly NOT_ADD_AUTHORIZATION_HEADER = 'Not-Add-Authorization';

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _snackbarService: SnackbarService,
    private _translateService: TranslateService,
    @Inject(REFRESH_JWT_REQUEST_COUNT_TOKEN)
    private _refreshJwtRequestCount$: BehaviorSubject<number>
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const modifiedRequest = this.modifyRequest(request);
    return next.handle(modifiedRequest).pipe(
      catchError(error => {
        if (
          error.status === HttpStatusCode.Unauthorized &&
          this._refreshJwtRequestCount$.value === 0
        ) {
          const refreshToken = this._authService.auth?.refreshToken;
          if (!refreshToken) {
            return throwError(() => error);
          }
          this._refreshJwtRequestCount$.next(
            this._refreshJwtRequestCount$.value + 1
          );
          return this._authService.refresh({ refreshToken }).pipe(
            catchError(() => {
              this.navigateToAuthPage();
              return EMPTY;
            }),
            mergeMap(() => {
              const modifiedRequest = this.modifyRequest(request);
              return next.handle(modifiedRequest);
            }),
            finalize(() =>
              this._refreshJwtRequestCount$.next(
                this._refreshJwtRequestCount$.value - 1
              )
            )
          );
        }
        return throwError(() => error);
      })
    );
  }

  private modifyRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const auth = this._authService.auth;
    const hasIgnoreAuthorizationHeader = request.headers.has(
      AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER
    );
    const needAuthorizationHeader = auth && !hasIgnoreAuthorizationHeader;
    return needAuthorizationHeader
      ? this.addAuthorizationHeader(request, auth)
      : hasIgnoreAuthorizationHeader
      ? request.clone({
          headers: request.headers.delete(
            AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER
          ),
        })
      : request;
  }

  private addAuthorizationHeader<T>(
    req: HttpRequest<T>,
    auth: Auth
  ): HttpRequest<T> {
    return req.clone({
      headers: req.headers.set(
        'Authorization',
        `${auth.tokenType} ${auth.accessToken}`
      ),
    });
  }

  /**
   * @param url request url
   */
  private navigateToAuthPage() {
    this._translateService.get('auth.session_expired').subscribe(message => {
      this._snackbarService.showInfo(message);
    });
    this._authService.logout();
    this._router.navigate(this._authService.AUTH_PAGE_PATH, {
      queryParams: { redirectTo: this._router.url },
    });
  }
}
