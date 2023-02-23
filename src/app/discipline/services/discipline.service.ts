import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import Modules from 'src/assets/modules.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discipline } from '../domain/discipline';
import { DisciplineAddRequest } from '../domain/discipline-add-request';
import { DisciplinePageableResponse } from '../domain/discipline-pageable-response';
import { Sort } from '@angular/material/sort';
import { DisciplineUpdateRequest } from '../domain/discipline-update-request';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.discipline.path}`;

  constructor(private _http: HttpClient) {}

  getLinkToSearchPage() {
    return `${Modules.discipline.path}`;
  }

  getLinkToFormPage(id: number) {
    return `${Modules.discipline.path}/${id}`;
  }

  getById(id: number): Observable<Discipline> {
    return this._http.get<Discipline>(`${this.MODULE_URL}/${id}`);
  }

  add(discipline: DisciplineAddRequest): Observable<Discipline> {
    return this._http.post<Discipline>(`${this.MODULE_URL}`, discipline);
  }

  update(
    id: number,
    discipline: DisciplineUpdateRequest
  ): Observable<Discipline> {
    return this._http.put<Discipline>(`${this.MODULE_URL}/${id}`, discipline);
  }

  search(
    query: string,
    size?: number,
    page?: number,
    sort?: Sort
  ): Observable<DisciplinePageableResponse> {
    let params = new HttpParams().set('query', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    if (sort) params = params.set('sort', `${sort.active},${sort.direction}`);
    return this._http.get<DisciplinePageableResponse>(
      `${this.MODULE_URL}/search`,
      {
        params: params,
      }
    );
  }
}
