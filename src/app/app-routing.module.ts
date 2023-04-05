import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './user/components/login-form/login-form.component';
import { UserLayoutComponent } from './user/components/user-layout/user-layout.component';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: UserListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
