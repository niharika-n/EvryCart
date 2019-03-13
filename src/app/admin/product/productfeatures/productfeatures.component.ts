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
        private spinnerService: SpinnerService) {
        this.keys = Object.keys(this.quantityType);
        this.model = {
            productId: 0,
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
                    this.model = result.product;
                    if (this.model.taxExempted) {
                        this.isTax = false;
                    }
                    if (this.model.isDiscounted) {
                        this.isDiscount = true;
                    }
                    if (!this.model.shipingEnabled) {
                        this.isShipping = false;
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
                if (result.status === 404) {
                    this.message = this.translate.instant('common.not-found');
                } else {
                    this.CategoryArr = result;
                }
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
                    if (!isNullOrUndefined(result.product)) {
                        this.toastr.success(this.translate.instant('common.update', { object: 'Product' }), '',
                            { positionClass: 'toast-top-right', timeOut: 5000 });
                        this.router.navigate(['admin/product']);
                        this.resetForm(form);
                    }
                    if (!isNullOrUndefined(result.sameNameMessage)) {
                        this.sameNameCheck = result.sameNameMessage;
                    } else {
                        this.sameNameCheck = '';
                    }
                    if (!isNullOrUndefined(result.sameModelMessage)) {
                        this.sameModelCheck = result.sameModelMessage;
                    } else {
                        this.sameModelCheck = '';
                    }
                });
            } else {
                this.productService.add(this.model).subscribe((result: any) => {
                    if (!isNullOrUndefined(result.productObj)) {
                        this.toastr.success(this.translate.instant('common.insert', { object: 'Product' }), '',
                            { positionClass: 'toast-top-right', timeOut: 5000 });
                        this.resetForm(form.value);
                    }
                    if (!isNullOrUndefined(result.sameNameMessage)) {
                        this.sameNameCheck = result.sameNameMessage;
                    } else {
                        this.sameNameCheck = '';
                    }
                    if (!isNullOrUndefined(result.sameModelMessage)) {
                        this.sameModelCheck = result.sameModelMessage;
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
