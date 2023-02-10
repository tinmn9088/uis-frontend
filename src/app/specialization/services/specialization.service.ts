import { Injectable } from '@angular/core';
import { Specialization } from '../domain/specialization';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import Modules from 'src/assets/modules.json';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private readonly MODULE_URL = `http://${environment.backendUrl}/${Modules.specialization.path}`;

  constructor(private _http: HttpClient) {}

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
}
