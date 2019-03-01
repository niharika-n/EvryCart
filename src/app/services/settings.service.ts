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

    Update(user: LoginUser, file?: File) {
        // const currentUser = JSON.parse(localStorage.getItem('token'));
        // const body = JSON.stringify(user);
        // const formData = new FormData();
        // formData.append('model', body);
        // if (file !== null) {
        //     formData.append('file', file);
        // }
        // const xhr = new XMLHttpRequest();
        // xhr.open('PUT', '/api/user/update');
        // xhr.setRequestHeader('accept', 'application/json');
        // xhr.setRequestHeader('Authorization', `Bearer ${currentUser}`);
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === 4) {
        //         if (xhr.status === 200) {
        //             localStorage.removeItem('user');
        //             localStorage.setItem('user', JSON.stringify(user));
        //             this.toastr.success('Settings Updated !', '', { positionClass: 'toast-top-center' });
        //         }
        //     }
        // };
        // xhr.send(formData);
    }

    changePassword(password, newPassword) {
        const queryParameters = new HttpParams().set('oldPassword', password).set('newPassword', newPassword);
        return this.httpclient.put('api/user/changePassword', {}, { params: queryParameters }).
            pipe(map(x => {
                return x;
            }));
    }
}

