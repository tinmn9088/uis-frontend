import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecializationListComponent } from './specialization/components/specialization-list/specialization-list.component';
import Modules from 'src/assets/modules.json';

const routes: Routes = [
  {
    path: Modules.specialization.path,
    children: [{ path: 'list', component: SpecializationListComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
