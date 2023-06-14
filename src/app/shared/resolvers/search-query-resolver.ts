import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const searchQueryResolver: ResolveFn<string | null> = (
  route: ActivatedRouteSnapshot
) => {
  return route.queryParamMap.get('q');
};
