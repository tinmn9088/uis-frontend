import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  constructor(private _router: Router) {}

  appendQueryParams(relativeTo: ActivatedRoute, queryParams: Params) {
    this._router.navigate([], {
      relativeTo,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  appendSort(relativeTo: ActivatedRoute, sort: Sort) {
    this.appendQueryParams(relativeTo, {
      sort: `${sort.active},${sort.direction}`,
    });
  }

  appendPagination(relativeTo: ActivatedRoute, size: number, page: number) {
    this.appendQueryParams(relativeTo, { size, page });
  }

  appendResourceName(relativeTo: ActivatedRoute, resourceName: string) {
    this.appendQueryParams(relativeTo, { resourceName });
  }

  appendSearchQuery(relativeTo: ActivatedRoute, searchQuery: string) {
    this.appendQueryParams(relativeTo, { q: searchQuery });
  }
}
