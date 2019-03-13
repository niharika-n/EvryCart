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
}

