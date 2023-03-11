import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';

export const JWT_HELPER_SERVICE_TOKEN = new InjectionToken<string>(
  'jwtHelperService'
);

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_HELPER_SERVICE_TOKEN, useValue: new JwtHelperService() },
  ],
})
export class AuthModule {}
