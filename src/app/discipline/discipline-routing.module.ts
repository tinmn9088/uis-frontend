import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisciplineListComponent } from './components/discipline-list/discipline-list.component';
import { DisciplineFormComponent } from './components/discipline-form/discipline-form.component';

const routes: Routes = [
  { path: 'list', component: DisciplineListComponent },
  { path: 'add', component: DisciplineFormComponent },
  { path: ':id', component: DisciplineFormComponent },
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
export class DisciplineRoutingModule {}
