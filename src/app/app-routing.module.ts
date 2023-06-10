import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { UserLayoutComponent } from './user/components/user-layout/user-layout.component';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { MainPageComponent } from './user/components/main-page/main-page.component';
import { RoleListComponent } from './user/components/role-list/role-list.component';
import { paginationResolver } from './shared/resolvers/pagination-resolver';
import { searchQueryResolver } from './shared/resolvers/search-query-resolver';

const routes: Routes = [
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: 'main',
        component: MainPageComponent,
      },
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UserListComponent,
        resolve: {
          pagination: paginationResolver,
          searchQuery: searchQueryResolver,
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'role',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'list',
            canActivateChild: [AuthGuard],
            component: RoleListComponent,
            resolve: {
              pagination: paginationResolver,
              searchQuery: searchQueryResolver,
            },
            runGuardsAndResolvers: 'paramsOrQueryParamsChange',
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
