import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './user/components/login-form/login-form.component';
import { UserLayoutComponent } from './user/components/user-layout/user-layout.component';
import { UserTableComponent } from './user/components/user-table/user-table.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
      },
      {
        path: 'list',
        component: UserTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
