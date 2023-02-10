import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecializationListComponent } from './specialization/components/specialization-list/specialization-list.component';
import Modules from 'src/assets/modules.json';
import { SpecializationFormComponent } from './specialization/components/specialization-form/specialization-form.component';

const routes: Routes = [
  {
    path: Modules.specialization.path,
    children: [
      { path: 'list', component: SpecializationListComponent },
      { path: 'create', component: SpecializationFormComponent },
      { path: ':id', component: SpecializationFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
