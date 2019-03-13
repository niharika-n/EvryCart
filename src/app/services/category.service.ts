import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { CategoryModel } from '../admin/category/category';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;
    getAll = false;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    Listing(search, page, size, column, order, getAllParent, getAll) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page).set('SortOrder', Order)
            .set('SortColumn', column).set('PageSize', Size).set('getAllParent', getAllParent).set('getAll', getAll);
        return this.httpclient.get('/api/category/listing', { params: queryParameters });
    }

    Detail(id) {
        return this.httpclient.get('/api/category/detail/' + id);
    }

    Delete(id) {
        const queryParameters = new HttpParams().set('ID', id);
        return this.httpclient.delete('/api/category/delete', { params: queryParameters });
    }

    getProducts(id, search, page, size, column, order) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page).set('SortOrder', Order)
            .set('SortColumn', column).set('PageSize', Size);
        return this.httpclient.get('api/category/getAssociatedProducts/' + id, {params: queryParameters});
    }
}




