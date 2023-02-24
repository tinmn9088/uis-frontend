import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryPageableResponse } from '../domain/category-pageable-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  search(
    query: string,
    size?: number,
    page?: number
  ): Observable<CategoryPageableResponse> {
    return of({ content: [], totalElements: 0 });
  }
}
