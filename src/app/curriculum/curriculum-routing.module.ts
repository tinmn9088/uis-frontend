import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { CurriculumFormComponent } from './components/curriculum-form/curriculum-form.component';
import { showDeleteResolver } from '../shared/resolvers/show-delete-resolver';
import { curriculumResolver } from './resolvers/curriculum-resolver';
import { paginationResolver } from '../shared/resolvers/pagination-resolver';
import { sortResolver } from '../shared/resolvers/sort-resolver';

const routes: Routes = [
  {
    path: 'list',
    component: CurriculumListComponent,
    resolve: {
      pagination: paginationResolver,
      sort: sortResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  { path: 'add', component: CurriculumFormComponent },
  {
    path: ':id',
    component: CurriculumFormComponent,
    resolve: { curriculum: curriculumResolver, showDelete: showDeleteResolver },
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
export class CurriculumRoutingModule {}
