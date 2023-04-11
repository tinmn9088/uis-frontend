import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RolePageableResponse } from '../domain/role-pageable-response';
import { RoleCreateRequest } from '../domain/role-create-request';
import { Role } from '../domain/role';
import { RoleUpdateRequest } from '../domain/role-update-request';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly URL = `http://${environment.backendUrl}/roles`;

  constructor(private _http: HttpClient) {}

  create(roleCreateRequest: RoleCreateRequest): Observable<Role> {
    return this._http.post<Role>(`${this.URL}`, roleCreateRequest);
  }

  update(id: number, role: RoleUpdateRequest): Observable<Role> {
    return this._http.put<Role>(`${this.URL}/${id}`, role);
  }

  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<RolePageableResponse> {
    let params = new HttpParams().set('name', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<RolePageableResponse>(`${this.URL}/search`, {
      params: params,
    });
  }
}
