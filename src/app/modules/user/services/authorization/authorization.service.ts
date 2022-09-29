import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { LoginRequest } from '../../models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private _http: HttpClient) {}

  // TODO: implement
  login(loginRequest: LoginRequest): Observable<boolean> {
    return throwError(() => new Error());
  }
}
