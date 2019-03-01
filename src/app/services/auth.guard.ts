import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './authorization.service';
import { LoginUser } from './../shared/login-model';
import { UserRoles } from '../app.enum';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: LoginUser;
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.auth.isLoggednIn()) {
      if (!isNullOrUndefined(route.data.roles)) {
        const roles: any[] = route.data.roles;
        const currentUserRoleId = this.user.roleID;
        const enumKey = UserRoles[currentUserRoleId];
        if (roles.indexOf(enumKey.toLowerCase()) > -1 && enumKey.toLowerCase() === 'admin') {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      }
      return false;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
