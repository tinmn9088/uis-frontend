import { Injectable } from '@angular/core';
import { Specialization } from '../domain/specialization';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import Modules from 'src/assets/modules.json';
import { Observable, map } from 'rxjs';
import { SpecializationAddRequest } from '../domain/specialization-add-request';
import { Router } from '@angular/router';
import { SpecializationPageableResponse } from '../domain/specialization-pageable-response';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.specialization.path}`;

  constructor(private _http: HttpClient, private _router: Router) {}

  navigateToViewPage(id: number) {
    this._router.navigateByUrl(`${Modules.specialization.path}/${id}`);
  }

  getParents(
    size?: number,
    page?: number
  ): Observable<SpecializationPageableResponse> {
    let params = new HttpParams();
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<SpecializationPageableResponse>(
      `${this.MODULE_URL}/parents`,
      { params: params }
    );
  }

  getById(id: number): Observable<Specialization> {
    return this._http.get<Specialization>(`${this.MODULE_URL}/${id}`);
  }

  getChildren(parentId: number): Observable<Specialization[]> {
    return this._http.get<Specialization[]>(
      `${this.MODULE_URL}/${parentId}/children`
    );
  }

  isExpandable(parentId: number): Observable<boolean> {
    return this.getById(parentId).pipe(map(spec => spec.hasChildren));
  }

  add(specialization: SpecializationAddRequest): Observable<Specialization> {
    return this._http.post<Specialization>(
      `${this.MODULE_URL}`,
      specialization
    );
  }

  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<SpecializationPageableResponse> {
    let params = new HttpParams().set('query', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<SpecializationPageableResponse>(
      `${this.MODULE_URL}/search`,
      {
        params: params,
      }
    );
  }
}
