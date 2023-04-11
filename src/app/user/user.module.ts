import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../auth/components/login-form/login-form.component';
import { SharedModule } from '../shared/shared.module';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserRightsManagementComponent } from './components/user-rights-management/user-rights-management.component';
import { UserEditFormComponent } from './components/user-edit-form/user-edit-form.component';
import { UserEditDialogComponent } from './components/user-edit-dialog/user-edit-dialog.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { UserCreateFormComponent } from './components/user-create-form/user-create-form.component';
import { UserCreateDialogComponent } from './components/user-create-dialog/user-create-dialog.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

@NgModule({
  declarations: [
    LoginFormComponent,
    UserLayoutComponent,
    UserTableComponent,
    UserListComponent,
    UserRightsManagementComponent,
    UserEditFormComponent,
    UserEditDialogComponent,
    MainPageComponent,
    UserCreateFormComponent,
    UserCreateDialogComponent,
    RoleFormComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class UserModule {}
