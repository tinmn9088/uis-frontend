import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import Modules from 'src/assets/modules.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discipline } from '../domain/discipline';
import { DisciplineAddRequest } from '../domain/discipline-add-request';
import { DisciplinePageableResponse } from '../domain/discipline-pageable-response';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.discipline.path}`;

  constructor(private _http: HttpClient) {}

  getLinkToFormPage(id: number) {
    return `${Modules.discipline.path}/${id}`;
  }

  getById(id: number): Observable<Discipline> {
    return this._http.get<Discipline>(`${this.MODULE_URL}/${id}`);
  }

  add(discipline: DisciplineAddRequest): Observable<Discipline> {
    return this._http.post<Discipline>(`${this.MODULE_URL}`, discipline);
  }

  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<DisciplinePageableResponse> {
    let params = new HttpParams().set('query', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<DisciplinePageableResponse>(
      `${this.MODULE_URL}/search`,
      {
        params: params,
      }
    );
  }
}
