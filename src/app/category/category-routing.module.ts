import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { categoryResolver } from './resolvers/category-resolver';
import { paginationResolver } from '../shared/resolvers/pagination-resolver';

const routes: Routes = [
  {
    path: 'list',
    component: CategoryListComponent,
    resolve: { pagination: paginationResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  { path: 'add', component: CategoryFormComponent },
  {
    path: ':id',
    component: CategoryFormComponent,
    resolve: { category: categoryResolver },
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
export class CategoryRoutingModule {}
