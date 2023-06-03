import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Modules from 'src/assets/modules.json';
import { environment } from 'src/environments/environment.development';
import { Curriculum } from '../domain/curriculum';
import { CurriculumAddRequest } from '../domain/curriculum-add-request';
import { CurriculumUpdateRequest } from '../domain/curriculum-update-request';
import { CurriculumPageableResponse } from '../domain/curriculum-pageable-response';
import { Sort } from '@angular/material/sort';
import { CurriculumDiscipline } from '../domain/curriculum-discipline';
import { CurriculumDisciplineAddRequest } from '../domain/curriculum-discipline-add-request';
import { CurriculumDisciplineUpdateRequest } from '../domain/curriculum-discipline-update-request';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.curriculum.resourcePath}`;

  constructor(private _http: HttpClient) {}

  getLinkToSearchPage() {
    return `${Modules.curriculum.path}`;
  }

  getLinkToFormPage(id: number) {
    return `${Modules.curriculum.path}/${id}`;
  }

  getById(id: number): Observable<Curriculum> {
    return this._http.get<Curriculum>(`${this.MODULE_URL}/${id}`);
  }

  add(curriculum: CurriculumAddRequest): Observable<Curriculum> {
    return this._http.post<Curriculum>(`${this.MODULE_URL}`, curriculum);
  }

  update(
    id: number,
    curriculum: CurriculumUpdateRequest
  ): Observable<Curriculum> {
    return this._http.put<Curriculum>(`${this.MODULE_URL}/${id}`, curriculum);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.MODULE_URL}/${id}`);
  }

  getAll(
    size?: number,
    page?: number,
    sort?: Sort
  ): Observable<CurriculumPageableResponse> {
    let params = new HttpParams();
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    if (sort) params = params.set('sort', `${sort.active},${sort.direction}`);
    return this._http.get<CurriculumPageableResponse>(`${this.MODULE_URL}`, {
      params: params,
    });
  }

  getAllDisciplines(curriculumId: number): Observable<CurriculumDiscipline[]> {
    return this._http.get<CurriculumDiscipline[]>(
      `${this.MODULE_URL}/${curriculumId}/disciplines`
    );
  }

  addDiscipline(
    curriculumDiscipline: CurriculumDisciplineAddRequest
  ): Observable<CurriculumDiscipline> {
    const curriculumId = curriculumDiscipline.curriculumId;
    const disciplineId = curriculumDiscipline.disciplineId;
    return this._http.post<CurriculumDiscipline>(
      `${this.MODULE_URL}/${curriculumId}/disciplines/${disciplineId}`,
      curriculumDiscipline
    );
  }

  updateDiscipline(
    curriculumDiscipline: CurriculumDisciplineUpdateRequest
  ): Observable<CurriculumDiscipline> {
    const curriculumId = curriculumDiscipline.curriculumId;
    const disciplineId = curriculumDiscipline.disciplineId;
    return this._http.put<CurriculumDiscipline>(
      `${this.MODULE_URL}/${curriculumId}/disciplines/${disciplineId}`,
      curriculumDiscipline
    );
  }

  removeDiscipline(
    curriculumId: number,
    disciplineId: number
  ): Observable<void> {
    return this._http.delete<void>(
      `${this.MODULE_URL}/${curriculumId}/disciplines/${disciplineId}`
    );
  }
}
