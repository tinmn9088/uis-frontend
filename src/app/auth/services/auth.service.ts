import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Auth } from 'src/app/user/models/auth';
import { User } from 'src/app/user/models/user';
import { LoginRequest } from 'src/app/user/models/login-request';
import { Observable, shareReplay, tap } from 'rxjs';
import { LoginResponse } from 'src/app/user/models/login-response';

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

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${this.URL}/tokens/create`, loginRequest)
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
}
