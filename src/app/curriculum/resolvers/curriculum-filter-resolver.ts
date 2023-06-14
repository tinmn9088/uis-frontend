import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { CurriculumSearchFilter } from '../domain/curriculum-search-filter';

export const curriculumFilterResolver: ResolveFn<
  CurriculumSearchFilter | undefined
> = (route: ActivatedRouteSnapshot) => {
  try {
    const value = route.queryParamMap.get('filter');
    return value && JSON.parse(value);
  } catch {
    return;
  }
};
