import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this._authService.auth.accessToken;
    const tokenType = this._authService.auth.tokenType;
    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set(
          'Authorization',
          `${tokenType} ${accessToken}`
        ),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
