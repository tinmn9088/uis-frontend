import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable, shareReplay, tap, mergeMap, map } from 'rxjs';
import { Auth } from '../domain/auth';
import { LoginRequest } from '../domain/login-request';
import { RefreshRequest } from '../domain/refresh-request';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { User } from 'src/app/user/domain/user';
import { JWT_HELPER_SERVICE_TOKEN } from '../auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/user/services/user.service';
import { Permission } from '../domain/permission';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL = `http://${environment.backendUrl}/security`;

  readonly AUTH_PAGE_PATH = ['user', 'login'];

  constructor(
    private _http: HttpClient,
    private _userService: UserService,
    @Inject(JWT_HELPER_SERVICE_TOKEN)
    private _jwtHelperService: JwtHelperService
  ) {}

  get user() {
    const userString = localStorage.getItem(environment.localStorageKeys.user);
    return userString ? JSON.parse(userString) : undefined;
  }

  set user(user: User) {
    localStorage.setItem(
      environment.localStorageKeys.user,
      JSON.stringify(user)
    );
  }

  get auth(): Auth {
    const authString = localStorage.getItem(environment.localStorageKeys.auth);
    return authString ? JSON.parse(authString) : undefined;
  }

  set auth(auth: Auth) {
    localStorage.setItem(
      environment.localStorageKeys.auth,
      JSON.stringify(auth)
    );
  }

  /**
   * Make login request and put response to local storage.
   */
  login(loginRequest: LoginRequest): Observable<Auth> {
    let headers = new HttpHeaders();
    headers = headers.append(AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER, '');

    return this._http
      .post<Auth>(`${this.URL}/tokens/create`, loginRequest, { headers })
      .pipe(
        shareReplay(), // to prevent the receiver of this Observable from accidentally triggering multiple POST requests
        mergeMap(authResponse => {
          console.debug('Authentication successful', authResponse);
          const tokenPayload = this._jwtHelperService.decodeToken(
            authResponse.accessToken
          );
          const userId = tokenPayload['user_id'];
          const permissions = tokenPayload['authorities'];
          this.auth = Object.assign(authResponse, { permissions });
          return this._userService.getById(userId).pipe(
            tap(userResponse => (this.user = userResponse)),
            map(() => authResponse)
          );
        })
      );
  }

  /**
   * Make refresh request and put response to local storage.
   */
  refresh(refreshRequest: RefreshRequest): Observable<Auth> {
    let headers = new HttpHeaders();
    headers = headers.append(AuthInterceptor.NOT_ADD_AUTHORIZATION_HEADER, '');

    return this._http
      .post<Auth>(`${this.URL}/tokens/refresh`, refreshRequest, { headers })
      .pipe(
        shareReplay(), // to prevent the receiver of this Observable from accidentally triggering multiple POST requests
        tap(response => {
          console.debug('Refresh successful', response);
          this.auth = response;
        })
      );
  }

  /**
   * Remove auth and user from local storage.
   */
  logout() {
    localStorage.removeItem(environment.localStorageKeys.auth);
    localStorage.removeItem(environment.localStorageKeys.user);
  }

  hasUserPermissions(permissionsNeeded: Permission[]): boolean {
    const currentUserPermissions = this.auth?.permissions;
    return permissionsNeeded.every(permission =>
      currentUserPermissions?.includes(permission)
    );
  }
}
