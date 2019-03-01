import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { } from 'angular-jwt';
import { LoginUser } from '../shared/login-model';

@Injectable()
export class AuthService {

    constructor(private myRoute: Router) { }

    getToken() {
        const token = localStorage.getItem('token');
        return !isNullOrUndefined(token) ? token : null;
    }

    isLoggednIn() {
        return this.getToken() !== null;
    }

    logout() {
        localStorage.removeItem('token');
        this.myRoute.navigate(['/login']);
    }
}
