import { RouterModule, Routes } from '@angular/router';
import Modules from 'src/assets/modules.json';
import { AppRoutingRedirectComponent } from './components/app-routing-redirect/app-routing-redirect.component';
import { NgModule } from '@angular/core';
import { ModuleLayoutComponent } from './components/module-layout/module-layout.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CategoryListComponent } from '../category/components/category-list/category-list.component';
import { CategoryFormComponent } from '../category/components/category-form/category-form.component';
import { CurriculumListComponent } from '../curriculum/components/curriculum-list/curriculum-list.component';
import { CurriculumFormComponent } from '../curriculum/components/curriculum-form/curriculum-form.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    component: ModuleLayoutComponent,
    children: [
      {
        path: Modules.category.path.slice(1),
        children: [
          {
            path: '',
            component: AppRoutingRedirectComponent,
            data: { redirectTo: 'list' },
          },
          { path: 'list', component: CategoryListComponent },
          { path: 'add', component: CategoryFormComponent },
          { path: ':id', component: CategoryFormComponent },
        ],
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
        children: [
          {
            path: '',
            component: AppRoutingRedirectComponent,
            data: { redirectTo: 'list' },
          },
          { path: 'list', component: CurriculumListComponent },
          { path: 'add', component: CurriculumFormComponent },
          { path: ':id', component: CurriculumFormComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule {}
