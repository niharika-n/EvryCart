import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { LoginUser } from '../shared/login-model';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    id = 0;
    file = null;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    Detail(id) {
        return this.httpclient.get('/api/user/detail/' + id);
    }

    changePassword(password, newPassword) {
        const queryParameters = new HttpParams().set('oldPassword', password).set('newPassword', newPassword);
        return this.httpclient.put('api/user/changePassword', {}, { params: queryParameters }).
            pipe(map(x => {
                return x;
            }));
    }

    userList(search, page, size, column, order) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page).set('SortOrder', Order)
            .set('SortColumn', column).set('PageSize', Size);
        return this.httpclient.get('api/user/getuserlist', { params: queryParameters });
    }

    changeUserRoles(id, check, rolesArr) {
        const userID = JSON.stringify(id);
        const addCheck = JSON.stringify(check);
        const roles = JSON.stringify(rolesArr);
        const selectedRoles = roles.substring(1, roles.length - 1);
        const queryParameters = new HttpParams().set('id', userID).set('add', addCheck).set('selectedRoles', selectedRoles);
        return this.httpclient.get('api/user/changeuserrole', { params: queryParameters });
    }
}

