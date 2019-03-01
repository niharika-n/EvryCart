import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    getProducts() {
        return this.httpclient.get('api/product/GetProductsForCustomer');
    }

    getProductImages(id) {
        return this.httpclient.get('api/product/GetProductImagesForCustomer/' + id);
    }

    getLatestCategories() {
        return this.httpclient.get('api/category/GetLatestCategoriesForCustomer');
    }
}
