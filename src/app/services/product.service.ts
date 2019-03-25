import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from '../admin/product/product';
import { ProductAttributeValueModel } from '../admin/product/product-attribute-value';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    search = '';
    id = 0;
    file = null;
    size = 0;
    order = true;
    imageID = 0;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    listing(search, page, size, column, order) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page)
            .set('SortOrder', Order).set('SortColumn', column).set('PageSize', Size);
        return this.httpclient.get('api/product/listing', { params: queryParameters });
    }

    detail(id) {
        return this.httpclient.get('api/product/getdetail/' + id);
    }

    add(product: ProductModel) {
        return this.httpclient.post('api/product/insertproduct', product).
        pipe(map(x => {
            return x;
        }));
    }

    update(product: ProductModel) {
        return this.httpclient.put('api/product/updateproduct', product).
            pipe(map(x => {
                return x;
            }));
    }

    delete(id) {
        const queryParameters = new HttpParams().set('ID', id);
        return this.httpclient.delete('api/product/delete', { params: queryParameters });
    }

    deleteProductImage(id, imageID) {
        const queryParameters = new HttpParams().set('pdtID', id).set('imageID', imageID);
        return this.httpclient.delete('api/product/deleteproductimage', { params: queryParameters });
    }

    listProductImages(id) {
        return this.httpclient.get('api/product/getproductimages/' + id);
    }

    addProductAttributeValue(attributeValue: ProductAttributeValueModel) {
        return this.httpclient.post('api/product/insertproductattributevalue', attributeValue).
            pipe(map(x => {
                return x;
            }));
    }

    deleteProductAttributeValue(id) {
        const queryParameters = new HttpParams().set('ID', id);
        return this.httpclient.delete('api/product/deleteproductattributevalue', { params: queryParameters });
    }

    listProductAttributeValue(id, search, page, size, column, order) {
        const Size = JSON.stringify(size);
        const Page = JSON.stringify(page);
        const Order = JSON.stringify(order);
        const queryParameters = new HttpParams().set('Search', search).set('PageNumber', Page)
            .set('SortOrder', Order).set('SortColumn', column).set('PageSize', Size);
        return this.httpclient.get('api/product/getlistproductattributevalue/' + id, { params: queryParameters });
    }

    detailProductAttributeValue(id) {
        return this.httpclient.get('api/product/getdetailproductattributevalue/' + id);
    }

    updateProductAttributeValue(attributeValue: any) {
        return this.httpclient.put('api/product/updateproductattributevalue', attributeValue);
    }
}
