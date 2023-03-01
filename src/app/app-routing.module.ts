import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './user/components/login-form/login-form.component';

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
