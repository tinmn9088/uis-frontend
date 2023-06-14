import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisciplineListComponent } from './components/discipline-list/discipline-list.component';
import { DisciplineFormComponent } from './components/discipline-form/discipline-form.component';
import { disciplineResolver } from './resolvers/discipline-resolver';
import { showDeleteResolver } from '../shared/resolvers/show-delete-resolver';
import { paginationResolver } from '../shared/resolvers/pagination-resolver';
import { sortResolver } from '../shared/resolvers/sort-resolver';
import { searchQueryResolver } from '../shared/resolvers/search-query-resolver';

const routes: Routes = [
  {
    path: 'list',
    component: DisciplineListComponent,
    resolve: {
      pagination: paginationResolver,
      sort: sortResolver,
      searchQuery: searchQueryResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  { path: 'add', component: DisciplineFormComponent },
  {
    path: ':id',
    component: DisciplineFormComponent,
    resolve: { discipline: disciplineResolver, showDelete: showDeleteResolver },
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
export class DisciplineRoutingModule {}
