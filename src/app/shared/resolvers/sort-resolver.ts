import { Sort } from '@angular/material/sort';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const sortResolver: ResolveFn<Sort | undefined> = (
  route: ActivatedRouteSnapshot
) => {
  const value = route.queryParamMap.get('sort');
  const sort = value?.split(',');
  return sort
    ? ({
        active: sort[0] || '',
        direction: sort[1] === 'desc' ? 'desc' : 'asc',
      } as Sort)
    : undefined;
};
