import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Curriculum } from '../domain/curriculum';
import { inject } from '@angular/core';
import { CurriculumService } from '../services/curriculum.service';
import { EMPTY, catchError } from 'rxjs';
import { ModuleService } from 'src/app/shared/services/module.service';

export const curriculumResolver: ResolveFn<Curriculum> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const moduleService = inject(ModuleService);
  const id = parseInt(route.paramMap.get('id') || '-1');
  return inject(CurriculumService)
    .getById(id)
    .pipe(
      catchError(() => {
        router.navigateByUrl(moduleService.getNotFoundPagePath());
        return EMPTY;
      })
    );
};
