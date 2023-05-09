import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { CurriculumFormComponent } from './components/curriculum-form/curriculum-form.component';

const routes: Routes = [
  { path: 'list', component: CurriculumListComponent },
  { path: 'add', component: CurriculumFormComponent },
  { path: ':id', component: CurriculumFormComponent },
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
export class CurriculumRoutingModule {}
