import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ModuleService } from 'src/app/shared/services/module.service';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../domain/category';
import { CategoryService } from '../services/category.service';

export const categoryResolver: ResolveFn<Category> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const moduleService = inject(ModuleService);
  const translate = inject(TranslateService);
  const id = parseInt(route.paramMap.get('id') || '-1');
  return inject(CategoryService)
    .getById(id)
    .pipe(
      catchError(() => {
        return new Observable<never>(subscriber => {
          translate.get('category.title').subscribe(title => {
            const resourceName = `${title} ${
              !Number.isNaN(id) ? id : route.paramMap.get('id')
            }`;
            router.navigateByUrl(
              `${moduleService.getNotFoundPagePath()}?resourceName=${resourceName}`
            );
            subscriber.complete();
          });
        });
      })
    );
};
