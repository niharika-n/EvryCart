import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { ProductAttributeModel } from '../admin/product-attributes/product-attribute';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductAttributeService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    listing(search, page, size, column, order, getAll) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page)
            .set('SortOrder', Order).set('SortColumn', column).set('PageSize', Size).set('getAll', getAll);
        return this.httpclient.get('api/productattributes/listing', { params: queryParameters });
    }

    detail(id) {
        return this.httpclient.get('api/productattributes/detail/' + id);
    }

    add(attribute: ProductAttributeModel) {
        return this.httpclient.post('api/productattributes/insertattribute', attribute).pipe(map(x => {
            return x;
        }));
    }

    update(attribute: ProductAttributeModel) {
        return this.httpclient.put('api/productattributes/updateattribute', attribute).pipe(map(x => {
            return x;
        }));
    }

    delete(id) {
        const queryParameters = new HttpParams().set('ID', id);
        return this.httpclient.delete('api/productattributes/delete', { params: queryParameters });
    }
}
