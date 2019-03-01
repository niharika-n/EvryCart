import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;
    getAll = false;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    getCategories() {
        return this.httpclient.get('api/category/GetCategoriesForCustomer');
    }

    getChildCategories(id) {
        return this.httpclient.get('api/category/GetChildCategoriesForCustomer/' + id);
    }
}
