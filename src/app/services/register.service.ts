import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../shared/login-model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    selectedUser: LoginUser = {
        userID: null,
        firstName: '',
        lastName: '',
        username: '',
        imageContent: '',
        emailID: '',
        roleID: null
    };
    @ViewChild('imageFile') imageFile: ElementRef;

    constructor(private http: HttpClient, private toastr: ToastrService) { }

    postLogin(user: LoginUser, file: File) {
        const body = JSON.stringify(user);
        const formData = new FormData();
        formData.append('model', body);
        formData.append('file', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/user/create');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.toastr.success('User Created !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
                }
            }
        };
        xhr.send(formData);
    }
}
