import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Curriculum } from '../domain/curriculum';
import { inject } from '@angular/core';
import { CurriculumService } from '../services/curriculum.service';
import { catchError, Observable } from 'rxjs';
import { ModuleService } from 'src/app/shared/services/module.service';
import { TranslateService } from '@ngx-translate/core';

export const curriculumResolver: ResolveFn<Curriculum> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const moduleService = inject(ModuleService);
  const translate = inject(TranslateService);
  const id = parseInt(route.paramMap.get('id') || '-1');
  return inject(CurriculumService)
    .getById(id)
    .pipe(
      catchError(() => {
        return new Observable<never>(subscriber => {
          translate.get('curricula.title').subscribe(title => {
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
