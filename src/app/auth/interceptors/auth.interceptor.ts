import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Auth } from '../domain/auth';

/**
 * Puts `Authorization` header with JWT in each request.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static readonly NOT_ADD_AUTHORIZATION_HEADER = 'Not-Add-Authorization';

  constructor(private _authService: AuthService) {}

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
    return next.handle(modifiedReq);
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
}
