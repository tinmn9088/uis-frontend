import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SpecializationListComponent } from './components/specialization-list/specialization-list.component';
import { SpecializationFormComponent } from './components/specialization-form/specialization-form.component';

const routes: Routes = [
  { path: 'list', component: SpecializationListComponent },
  { path: 'add', component: SpecializationFormComponent },
  { path: ':id', component: SpecializationFormComponent },
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
