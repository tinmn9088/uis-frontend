import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SpecializationFormComponent } from './components/specialization-form/specialization-form.component';
import { specializationResolver } from './resolvers/specialization-resolver';
import { paginationResolver } from '../shared/resolvers/pagination-resolver';

const routes: Routes = [
  {
    path: 'list',
    component: SpecializationListComponent,
    resolve: { pagination: paginationResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  { path: 'add', component: SpecializationFormComponent },
  {
    path: ':id',
    component: SpecializationFormComponent,
    resolve: { specialization: specializationResolver },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecializationRoutingModule {}
