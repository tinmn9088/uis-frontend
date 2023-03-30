import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/app/user/models/user';
import { Observable, shareReplay, tap } from 'rxjs';
import { Auth } from '../domain/auth';
import { LoginRequest } from '../domain/login-request';
import { RefreshRequest } from '../domain/refresh-request';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL = `http://${environment.backendUrl}/security`;

  readonly AUTH_PAGE_PATH = ['user', 'login'];

  constructor(private _http: HttpClient) {}

  get user() {
    const userString = localStorage.getItem(environment.localStorageKeys.user);
    return userString ? JSON.parse(userString) : undefined;
  }

  set user(user: User) {
    localStorage.setItem(
      environment.localStorageKeys.user,
      JSON.stringify(user)
    );
  }

  get auth(): Auth {
    const authString = localStorage.getItem(environment.localStorageKeys.auth);
    return authString ? JSON.parse(authString) : undefined;
  }

  set auth(auth: Auth) {
    localStorage.setItem(
      environment.localStorageKeys.auth,
      JSON.stringify(auth)
    );
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
          this.auth = response;
          this.user = { login: loginRequest.username, roles: [] };
        })
      );
  }

  /**
   * Make refresh request and put response to local storage.
   */
  refresh(refreshRequest: RefreshRequest): Observable<Auth> {
    let headers = new HttpHeaders();
    headers = headers.append(AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER, '');

    return this._http
      .post<Auth>(`${this.URL}/tokens/refresh`, refreshRequest, { headers })
      .pipe(
        shareReplay(), // to prevent the receiver of this Observable from accidentally triggering multiple POST requests
        tap(response => {
          console.debug('Refresh successful', response);
          this.auth = response;
        })
      );
  }

  /**
   * Remove auth and user from local storage.
   */
  logout() {
    localStorage.removeItem(environment.localStorageKeys.auth);
    localStorage.removeItem(environment.localStorageKeys.user);
  }
}
