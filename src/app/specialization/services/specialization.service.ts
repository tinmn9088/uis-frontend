import { Injectable } from '@angular/core';
import { Specialization } from '../domain/specialization';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import Modules from 'src/assets/modules.json';
import { Observable, map } from 'rxjs';
import { SpecializationAddRequest } from '../domain/specialization-add-request';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.specialization.path}`;

  constructor(private _http: HttpClient, private _router: Router) {}

  navigateToViewPage(id: number) {
    this._router.navigateByUrl(`${Modules.specialization.path}/${id}`);
  }

  getParents(): Observable<Specialization[]> {
    return this._http.get<Specialization[]>(`${this.MODULE_URL}/parents`);
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

  search(query: string): Observable<Specialization[]> {
    const params = new HttpParams().set('q', query);
    return this._http.get<Specialization[]>(`${this.MODULE_URL}/search`, {
      params: params,
    });
  }
}
