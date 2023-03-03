import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SharedModule } from '../shared/shared.module';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserTableComponent } from './components/user-table/user-table.component';

@NgModule({
  declarations: [LoginFormComponent, UserLayoutComponent, UserTableComponent],
  imports: [CommonModule, SharedModule],
})
export class UserModule {}
