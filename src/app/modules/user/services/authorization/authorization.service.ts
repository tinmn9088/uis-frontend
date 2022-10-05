import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/modules/shared/services/app-config/app-config.service';
import { LoginRequest } from '../../models/login-request.model';
import { LoginResponse } from '../../models/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private readonly _url: string;

  constructor(private _http: HttpClient, private _appConfig: AppConfigService) {
    this._url = this._appConfig.config.baseUrl + '/api/auth/login';
  }

  login(loginRequest: LoginRequest): Observable<void> {
    return new Observable((subscriber) => {
      if (!loginRequest) {
        subscriber.error("Empty login request.");
      }

      this._http.post<LoginResponse>(this._url, loginRequest)
      .subscribe({
        next: (response: LoginResponse) => {
          localStorage.setItem(this._appConfig.config.localStorageKeys.jwt.access, response.accessToken);
          localStorage.setItem(this._appConfig.config.localStorageKeys.jwt.refresh, response.refreshToken);
          subscriber.complete();
        },
        error: (err) => {
          subscriber.error(err);
        }
      });
    });
  }
}
