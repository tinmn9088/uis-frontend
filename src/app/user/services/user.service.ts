import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { LoginRequest } from '../models/login-request';
import { Observable, shareReplay, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import Modules from 'src/assets/modules.json';
import { UserPageableResponse } from '../domain/user-pageable-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = `http://${environment.backendUrl}`;

  constructor(private _http: HttpClient) {}

  get linkToSearchPage() {
    return `${Modules.user.path}`;
  }

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

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${this.URL}/auth/login`, loginRequest)
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

  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<UserPageableResponse> {
    let params = new HttpParams().set('query', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<UserPageableResponse>(`${this.URL}/users/search`, {
      params: params,
    });
  }
}
