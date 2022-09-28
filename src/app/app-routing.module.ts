import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/user/components/login/login.component';
import { PageNotFoundComponent } from './modules/error-pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'users',
    children: [
      { path: 'login', component: LoginComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
