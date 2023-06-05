import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const showDeleteResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
) => {
  const value = route.queryParamMap.get('showDelete') || '';
  return !!value && !!JSON.parse(value);
};
