import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import Modules from 'src/assets/modules.json';
import { CategoryPageableResponse } from '../domain/category-pageable-response';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CategoryAddRequest } from '../domain/category-add-request';
import { Category } from '../domain/category';
import { CategoryUpdateRequest } from '../domain/category-update-request';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly MODULE_URL = `http://${environment.backendUrl}${Modules.category.resourcePath}`;

  constructor(private _http: HttpClient) {}

  getLinkToSearchPage() {
    return `${Modules.category.path}`;
  }

  getLinkToFormPage(id: number) {
    return `${Modules.category.path}/${id}`;
  }

  getById(id: number): Observable<Category> {
    return this._http.get<Category>(`${this.MODULE_URL}/${id}`);
  }

  getParents(
    size?: number,
    page?: number
  ): Observable<CategoryPageableResponse> {
    let params = new HttpParams();
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<CategoryPageableResponse>(
      `${this.MODULE_URL}/parents`,
      { params: params }
    );
  }

  getChildren(parentId: number): Observable<Category[]> {
    return this._http.get<Category[]>(
      `${this.MODULE_URL}/${parentId}/children`
    );
  }

  isExpandable(parentId: number): Observable<boolean> {
    return this.getById(parentId).pipe(map(category => category.hasChildren));
  }

  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<CategoryPageableResponse> {
    let params = new HttpParams().set('name', query);
    if (size) params = params.set('size', size);
    if (page) params = params.set('page', page);
    return this._http.get<CategoryPageableResponse>(
      `${this.MODULE_URL}/search`,
      {
        params: params,
      }
    );
  }

  add(category: CategoryAddRequest): Observable<Category> {
    return this._http.post<Category>(`${this.MODULE_URL}`, category);
  }

  update(id: number, category: CategoryUpdateRequest): Observable<Category> {
    return this._http.put<Category>(`${this.MODULE_URL}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.MODULE_URL}/${id}`);
  }
}
