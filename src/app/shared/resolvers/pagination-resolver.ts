import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const paginationResolver: ResolveFn<{ size: number; page: number }> = (
  route: ActivatedRouteSnapshot
) => {
  const size = parseInt(route.queryParamMap.get('size') || '10');
  const page = parseInt(route.queryParamMap.get('page') || '0');
  return { size, page };
};
