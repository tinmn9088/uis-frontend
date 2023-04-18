import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { PermissionScope } from '../domain/permission-scope';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly URL = `http://${environment.backendUrl}/permissions`;

  constructor(private _http: HttpClient) {}

  getAllScopes(): Observable<PermissionScope[]> {
    return this._http.get<PermissionScope[]>(`${this.URL}`);
  }
}
