import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import Modules from 'src/assets/modules.json';
import { UserPageableResponse } from '../domain/user-pageable-response';
import { User } from '../domain/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.user.resourcePath}`;

  constructor(private _http: HttpClient) {}

  get linkToSearchPage() {
    return `${Modules.user.path}`;
  }

  getById(id: number): Observable<User> {
    return this._http.get<User>(`${this.MODULE_URL}/${id}`);
  }

  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<UserPageableResponse> {
    let params = new HttpParams().set('username', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<UserPageableResponse>(`${this.MODULE_URL}/search`, {
      params: params,
    });
  }

  grantRole(userId: number, roleId: number): Observable<void> {
    return this._http.post<void>(
      `${this.MODULE_URL}/${userId}/roles/${roleId}`,
      null
    );
  }

  revokeRole(userId: number, roleId: number): Observable<void> {
    return this._http.delete<void>(
      `${this.MODULE_URL}/${userId}/roles/${roleId}`
    );
  }
}
