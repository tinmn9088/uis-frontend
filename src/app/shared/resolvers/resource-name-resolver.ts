import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const resourceNameResolver: ResolveFn<string | null> = (
  route: ActivatedRouteSnapshot
) => {
  return route.queryParamMap.get('resourceName');
};
