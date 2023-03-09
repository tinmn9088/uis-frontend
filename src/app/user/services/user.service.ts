import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import Modules from 'src/assets/modules.json';
import { UserPageableResponse } from '../domain/user-pageable-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = `http://${environment.backendUrl}`;

  constructor(private _http: HttpClient) {}

  get linkToSearchPage() {
    return `${Modules.user.path}`;
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
