import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }
  login(username: string, password: string): Observable<any> {
    const queryParameters = new HttpParams().set('username', username).set('password', password);
    return this.httpClient.get('api/login/loginuser', { params: queryParameters }).
      pipe(map(x => {
        return x;
      }));
  }

  validateToken(token) {
    const queryParameters = new HttpParams().set('token', token);
    return this.httpClient.get('api/login/validatetoken', { params: queryParameters });
  }

  forgotPassword(username: string) {
    const queryParameters = new HttpParams().set('Username', username);
    return this.httpClient.get('api/login/forgotpassword', { params: queryParameters }).
      pipe(map(x => {
        return x;
      }));
  }

  resetPassword(token, password) {
    const queryParameters = {
      'userToken': token,
      'newPassword': password
    };
    return this.httpClient.put('api/login/changepassword', {}, { params: queryParameters }).
      pipe(map(x => {
        return x;
      }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    this.router.navigate(['../logout']);
  }
}
