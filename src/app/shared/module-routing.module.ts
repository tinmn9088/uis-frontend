import { RouterModule, Routes } from '@angular/router';
import Modules from 'src/assets/modules.json';
import { NgModule } from '@angular/core';
import { ModuleLayoutComponent } from './components/module-layout/module-layout.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    component: ModuleLayoutComponent,
    children: [
      {
        path: Modules.category.path.slice(1),
        loadChildren: () =>
          import('../category/category.module').then(m => m.CategoryModule),
      },
      {
        path: Modules.specialization.path.slice(1),
        loadChildren: () =>
          import('../specialization/specialization.module').then(
            m => m.SpecializationModule
          ),
      },
      {
        path: Modules.discipline.path.slice(1),
        loadChildren: () =>
          import('../discipline/discipline.module').then(
            m => m.DisciplineModule
          ),
      },
      {
        path: Modules.curriculum.path.slice(1),
        loadChildren: () =>
          import('../curriculum/curriculum.module').then(
            m => m.CurriculumModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule {}
