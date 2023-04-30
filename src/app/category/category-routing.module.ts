import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

const routes: Routes = [
  { path: 'list', component: CategoryListComponent },
  { path: 'add', component: CategoryFormComponent },
  { path: ':id', component: CategoryFormComponent },
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
export class CategoryRoutingModule {}
