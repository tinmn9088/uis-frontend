import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { UserLayoutComponent } from './user/components/user-layout/user-layout.component';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { MainPageComponent } from './user/components/main-page/main-page.component';
import { AppRoutingRedirectComponent } from './shared/components/app-routing-redirect/app-routing-redirect.component';
import { RoleListComponent } from './user/components/role-list/role-list.component';

const routes: Routes = [
  {
    path: '',
    component: AppRoutingRedirectComponent,
    data: { redirectTo: 'user' },
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        component: AppRoutingRedirectComponent,
        data: { redirectTo: 'main' },
      },
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
      },
      {
        path: 'role',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: AppRoutingRedirectComponent,
            data: { redirectTo: 'list' },
          },
          {
            path: 'list',
            canActivateChild: [AuthGuard],
            component: RoleListComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
