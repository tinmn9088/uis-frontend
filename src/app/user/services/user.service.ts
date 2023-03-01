import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { LoginRequest } from '../models/login-request';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = `http://${environment.backendUrl}/auth`;

  constructor(private _http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${this.URL}/login`, loginRequest)
      .pipe(
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
