import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Auth } from '../domain/auth';
import { Router } from '@angular/router';

/**
 * Puts `Authorization` header with JWT in each request.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static readonly NOT_ADD_AUTHORIZATION_HEADER = 'Not-Add-Authorization';

  constructor(private _authService: AuthService, private _router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const auth = this._authService.auth;
    const hasIgnoreAuthorizationHeader = req.headers.has(
      AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER
    );
    const needAuthorizationHeader = auth && !hasIgnoreAuthorizationHeader;
    const modifiedReq = needAuthorizationHeader
      ? this.addAuthorizationHeader(req, auth)
      : hasIgnoreAuthorizationHeader
      ? req.clone({
          headers: req.headers.delete(
            AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER
          ),
        })
      : req;
    if (auth) {
      console.debug('`Authorization` header added.');
    }
    return next.handle(modifiedReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.navigateToAuthPage();
        }
        return throwError(() => error);
      })
    );
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
    this._router.navigate(this._authService.AUTH_PAGE_PATH, {
      queryParams: { redirectTo: this._router.url },
    });
  }
}
