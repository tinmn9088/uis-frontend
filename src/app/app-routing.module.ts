import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecializationListComponent } from './specialization/components/specialization-list/specialization-list.component';

const routes: Routes = [
  {
    path: 'specializations',
    children: [{ path: 'list', component: SpecializationListComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
