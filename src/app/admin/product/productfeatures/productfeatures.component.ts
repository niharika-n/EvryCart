import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined, isDate } from 'util';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';

import { ProductService } from '../../../services/product.service';
import { ProductModel } from '../product';
import { CategoryService } from '../../../services/category.service';
import { QuantityType } from './product.enum';
import {ErrorService} from '../../../services/error.service';

@Component({
    selector: 'app-productfeatures',
    templateUrl: './productfeatures.component.html',
    styleUrls: ['./productfeatures.component.css']
})
export class ProductfeaturesComponent implements OnInit {
    model: ProductModel;
    CategoryArr: any[];
    submitted = false;
    pageTitle = '';
    id = 0;
    message = '';
    sameNameCheck = '';
    sameModelCheck = '';
    isTax = true;
    isDiscount = false;
    isShipping = true;
    editPage = false;
    dateToday = new Date();
    minDate = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate());
    maxDate = null;
    quantityType = QuantityType;
    keys: any;

    constructor(private productService: ProductService, private router: Router,
        private translate: TranslateService, private route: ActivatedRoute,
        private categoryservice: CategoryService, private toastr: ToastrService,
        private spinnerService: SpinnerService, private errorService: ErrorService) {
        this.keys = Object.keys(this.quantityType);
        this.model = {
            productID: 0,
            productName: '',
            shortDescription: '',
            longDescription: '',
            isActive: false,
            categoryID: 0,
            createdBy: 0,
            createdDate: new Date(),
            createdUser: '',
            price: null,
            quantityInStock: null,
            quantityType: '0',
            visibleEndDate: null,
            allowCustomerReviews: true,
            discountPercent: null,
            isDiscounted: false,
            markNew: false,
            onHomePage: false,
            shippingCharges: null,
            shipingEnabled: true,
            tax: null,
            taxExempted: false,
            visibleStartDate: null,
            modelNumber: ''
        };
    }

    ngOnInit() {
        this.pageStart();
    }

    pageStart() {
        if (this.id === 0) {
            this.id = +this.route.snapshot.paramMap.get('id');
        }
        if (this.id) {
            this.editPage = true;
            this.spinnerService.startRequest();
            this.productService.detail(this.id)
                .subscribe((result: any) => {
                    this.spinnerService.endRequest();
                    this.pageTitle = this.translate.instant('product-detail.edit');
                    if (result.status === 1) {
                        if (!isNullOrUndefined(result.body)) {
                        this.model = result.body;
                        }
                        if (this.model.taxExempted) {
                            this.isTax = false;
                        }
                        if (this.model.isDiscounted) {
                            this.isDiscount = true;
                        }
                        if (!this.model.shipingEnabled) {
                            this.isShipping = false;
                        }
                    }
                });
        } else {
            this.editPage = false;
            this.pageTitle = this.translate.instant('product-detail.add');
        }
        this.getCategoryList();
    }

    selectTax() {
        if (!this.model.taxExempted) {
            this.isTax = true;
        } else {
            this.isTax = false;
        }
    }

    selectDiscount() {
        if (this.model.isDiscounted) {
            this.isDiscount = true;
        } else {
            this.isDiscount = false;
        }
    }

    selectShipping() {
        if (this.model.shipingEnabled) {
            this.isShipping = true;
        } else {
            this.isShipping = false;
        }
    }

    getCategoryList() {
        this.categoryservice.Listing('', 1, 5, this.model.createdDate, false, true, true).
            subscribe((result: any) => {
                if (result.status !== 1) {
                    this.errorService.handleError(result.statusCode);
                    this.message = this.translate.instant('common.not-found');
                } else {
                    if (!isNullOrUndefined(result.body)) {
                    this.CategoryArr = result.body;
                    }
                }
            }, (error: any) => {
                this.spinnerService.endRequest();
                this.errorService.handleError(error.status);
                this.message = this.translate.instant('common.not-present', { param: 'attribute' });
              });
    }

    endDate(visibleStartDate: Date) {
        if (visibleStartDate !== null) {
            this.maxDate = new Date(visibleStartDate.getFullYear(), visibleStartDate.getMonth(), visibleStartDate.getDate() + 1);
        }
    }

    editSameName(event: any) {
        if (this.sameNameCheck !== '') {
            this.sameNameCheck = '';
        }
    }

    editSameModel(event: any) {
        if (this.sameModelCheck !== '') {
            this.sameModelCheck = '';
        }
    }

    add(form: NgForm) {
        if (form.valid) {
            if (this.id) {
                this.productService.update(form.value).subscribe((result: any) => {
                    if (result.status === 1) {
                        this.toastr.success(this.translate.instant('common.update', { param: 'Product' }), '');
                        this.router.navigate(['admin/product']);
                        this.resetForm(form);
                    }
                    if (!isNullOrUndefined(result.message === 'SameName')) {
                        this.sameNameCheck = this.translate.instant('product-detail.same-name-message');
                    } else {
                        this.sameNameCheck = '';
                    }
                    if (!isNullOrUndefined(result.message === 'SameModel')) {
                        this.sameModelCheck = this.translate.instant('product-detail.same-model-message');
                    } else {
                        this.sameModelCheck = '';
                    }
                });
            } else {
                this.productService.add(this.model).subscribe((result: any) => {
                    if (result.status === 1) {
                        this.toastr.success(this.translate.instant('common.insert', { param: 'Product' }), '');
                        this.resetForm(form);
                    }
                    if (result.message === 'SameName') {
                        this.sameNameCheck = this.translate.instant('product-detail.same-name-message');
                    } else {
                        this.sameNameCheck = '';
                    }
                    if (result.message === 'SameModel') {
                        this.sameModelCheck = this.translate.instant('product-detail.same-model-message');
                    } else {
                        this.sameModelCheck = '';
                    }
                });
            }
        }
        this.submitted = true;
    }

    resetForm(form: NgForm) {
        form.reset();
        if (this.id) {
            this.pageStart();
        }
        this.submitted = false;
    }
}
