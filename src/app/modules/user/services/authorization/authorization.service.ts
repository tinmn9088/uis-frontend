import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../../models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  // TODO: implement
  login(loginRequest: LoginRequest): Observable<boolean> {
    return of(true);
  }
}
