import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  constructor(private _router: Router) {}

  generateSortParam(sort: Sort): Params {
    return {
      sort: `${sort.active},${sort.direction}`,
    };
  }

  generatePaginationParam(size: number, page: number): Params {
    return { size, page };
  }

  generateResourceNameParam(resourceName: string): Params {
    return { resourceName };
  }

  generateSearchQueryParam(searchQuery: string): Params {
    return { q: searchQuery };
  }

  mergeParams(...params: Params[]): Params {
    const result = {};
    for (const param of params) {
      Object.assign(result, param);
    }
    return result;
  }

  appendQueryParams(relativeTo: ActivatedRoute, queryParams: Params) {
    this._router.navigate([], {
      relativeTo,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  appendSort(relativeTo: ActivatedRoute, sort: Sort) {
    this.appendQueryParams(relativeTo, this.generateSortParam(sort));
  }

  appendPagination(relativeTo: ActivatedRoute, size: number, page: number) {
    this.appendQueryParams(
      relativeTo,
      this.generatePaginationParam(size, page)
    );
  }

  appendResourceName(relativeTo: ActivatedRoute, resourceName: string) {
    this.appendQueryParams(
      relativeTo,
      this.generateResourceNameParam(resourceName)
    );
  }

  appendSearchQuery(relativeTo: ActivatedRoute, searchQuery: string) {
    this.appendQueryParams(
      relativeTo,
      this.generateSearchQueryParam(searchQuery)
    );
  }
}
