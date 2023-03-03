import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { LoginRequest } from '../models/login-request';
import { Observable, of, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import Modules from 'src/assets/modules.json';
import { UserPageableResponse } from '../domain/user-pageable-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = `http://${environment.backendUrl}`;

  constructor(private _http: HttpClient) {}

  getLinkToSearchPage() {
    return `${Modules.user.path}`;
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${this.URL}/auth/login`, loginRequest)
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
