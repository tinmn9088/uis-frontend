import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthorizationService } from './services/authorization/authorization.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginFormComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule
  ],
  providers: [AuthorizationService]
})
export class UserModule { }
