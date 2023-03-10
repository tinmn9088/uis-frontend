import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/app/user/models/user';
import { Observable, shareReplay, tap } from 'rxjs';
import { Auth } from '../domain/auth';
import { LoginRequest } from '../domain/login-request';
import { RefreshRequest } from '../domain/refresh-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL = `http://${environment.backendUrl}/security`;

  constructor(private _http: HttpClient) {}

  // TODO: return undefined if no user in localStorage
  get user() {
    const userString = localStorage.getItem(environment.localStorageKeys.user);
    return userString ? JSON.parse(userString) : { login: 'User1' };
  }

  set user(user: User | undefined) {
    localStorage.setItem(
      environment.localStorageKeys.user,
      JSON.stringify(user)
    );
  }

  get auth(): Auth {
    const authString = localStorage.getItem(environment.localStorageKeys.auth);
    return authString ? JSON.parse(authString) : {};
  }

  /**
   * Make login request and put response to local storage.
   */
  login(loginRequest: LoginRequest): Observable<Auth> {
    return this._http
      .post<Auth>(`${this.URL}/tokens/create`, loginRequest)
      .pipe(
        shareReplay(), // to prevent the receiver of this Observable from accidentally triggering multiple POST requests
        tap(response => {
          console.debug('Authentication successful', response);
          localStorage.setItem(
            environment.localStorageKeys.auth,
            JSON.stringify(response)
          );
        })
      );
  }

  /**
   * Make refresh request and put response to local storage.
   */
  refresh(refreshRequest: RefreshRequest): Observable<Auth> {
    return this._http
      .post<Auth>(`${this.URL}/tokens/refresh`, refreshRequest)
      .pipe(
        shareReplay(), // to prevent the receiver of this Observable from accidentally triggering multiple POST requests
        tap(response => {
          console.debug('Refresh successful', response);
          localStorage.setItem(
            environment.localStorageKeys.auth,
            JSON.stringify(response)
          );
        })
      );
  }
}
