import { RouterModule, Routes } from '@angular/router';
import Modules from 'src/assets/modules.json';
import { AppRoutingRedirectComponent } from './components/app-routing-redirect/app-routing-redirect.component';
import { SpecializationListComponent } from '../specialization/components/specialization-list/specialization-list.component';
import { SpecializationFormComponent } from '../specialization/components/specialization-form/specialization-form.component';
import { DisciplineListComponent } from '../discipline/components/discipline-list/discipline-list.component';
import { DisciplineFormComponent } from '../discipline/components/discipline-form/discipline-form.component';
import { NgModule } from '@angular/core';
import { ModuleLayoutComponent } from './components/module-layout/module-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ModuleLayoutComponent,
    children: [
      {
        path: Modules.specialization.path.slice(1),
        children: [
          {
            path: '',
            component: AppRoutingRedirectComponent,
            data: { redirectTo: 'list' },
          },
          { path: 'list', component: SpecializationListComponent },
          { path: 'add', component: SpecializationFormComponent },
          { path: ':id', component: SpecializationFormComponent },
        ],
      },
      {
        path: Modules.discipline.path.slice(1),
        children: [
          {
            path: '',
            component: AppRoutingRedirectComponent,
            data: { redirectTo: 'list' },
          },
          { path: 'list', component: DisciplineListComponent },
          { path: 'add', component: DisciplineFormComponent },
          { path: ':id', component: DisciplineFormComponent },
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
