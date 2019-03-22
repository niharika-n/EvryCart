import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductAttributeService } from '../../../../services/product-attributes.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../../../../services/error.service';

import { ProductService } from '../../../../services/product.service';
import { ProductAttributeValueModel } from '../../product-attribute-value';
import { PagerService } from '../../../../services/pagination.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
    selector: 'app-product-attribute-values',
    templateUrl: './product-attribute-values.component.html',
    styleUrls: ['./product-attribute-values.component.css']
})
export class ProductAttributeValuesComponent implements OnInit {
    AttributeArr: any[];
    model: ProductAttributeValueModel;
    id = 0;
    attrID = 0;
    attrValueID = 0;
    message = '';
    attributeMessage = false;
    isAttribute = false;
    existingAttributes = false;
    attributeValues = [];
    @ViewChild('AttributeID') pdtAttributeID: ElementRef;
    @ViewChild('AttrValue') pdtAttributeValue: ElementRef;
    totalCount = 0;
    pager: any = [];
    pageSize = 4;
    currentPage = 1;
    attributeValMessage = '';
    submitted = false;

    constructor(private productService: ProductService, private route: ActivatedRoute, private errorService: ErrorService,
        private pagerService: PagerService, private toastr: ToastrService, private translate: TranslateService,
        private attributeservice: ProductAttributeService, private spinnerService: SpinnerService) {
        this.model = {
            attributeID: 0,
            id: 0,
            productID: 0,
            value: ''
        };
    }

    ngOnInit() {
        this.pageStart();
    }

    pageStart() {
        if (this.id === 0) {
            this.id = +this.route.snapshot.paramMap.get('id');
            this.model.productID = this.id;
            this.getAttributeList();
        }
    }

    showAttributeValueForm() {
        if (!this.isAttribute) {
            this.isAttribute = true;
        } else {
            this.isAttribute = false;
        }
    }

    getAttributeList() {
        if (this.attributeValues.length === 0) {
            this.attributeMessage = true;
        } else {
            this.attributeMessage = false;
        }
        this.spinnerService.startRequest();
        this.attributeservice.listing('', 1, 5, new Date(), false, true).
            subscribe((result: any) => {
                this.spinnerService.endRequest();
                if (result.status !== 1) {
                    this.errorService.handleFailure(result.statusCode);
                    this.message = this.translate.instant('common.not-found');
                } else {
                    if (!isNullOrUndefined(result.body)) {
                        this.AttributeArr = result.body;
                    }
                }
            }, (error: any) => {
                this.spinnerService.endRequest();
                this.errorService.handleError(error.status);
                if (error.status !== 1) {
                    this.message = this.translate.instant('common.not-found');
                }
            });
        this.listAttribute(1, this.pageSize);
    }

    addAttribute(attrID: number, attrValue: string, form: NgForm) {
        this.submitted = true;
        if (form.valid) {
            if (this.attrValueID === 0) {
                this.productService.addProductAttributeValue(this.model).
                    subscribe((result: any) => {
                        if (result.status === 1) {
                            this.toastr.success(this.translate.instant('common.insert', { param: 'Attribute' }), '');
                            this.listAttribute(1, this.pageSize);
                            this.isAttribute = true;
                            this.resetForm(form);
                        }
                        if (result.message === 'isValue') {
                            this.attributeValMessage = this.translate.instant('product.attribute-present');
                        } else {
                            this.attributeValMessage = '';
                        }
                    }, (error: any) => {
                        this.spinnerService.endRequest();
                        this.errorService.handleError(error.status);
                    });
            } else {
                this.model = ({
                    id: this.attrValueID, attributeID: Number(attrID),
                    productID: this.id, value: attrValue
                });
                if (!isNullOrUndefined(this.model)) {
                    this.productService.updateProductAttributeValue(this.model).
                        subscribe((result: any) => {
                            if (result.status === 1) {
                                this.toastr.success(this.translate.instant('common.update', { param: 'Attribute' }), '');
                                this.listAttribute(1, this.pageSize);
                                this.isAttribute = false;
                            }
                            if (result.message) {
                                this.attributeValMessage = this.translate.instant('product.attribute-present');
                            } else {
                                this.attributeValMessage = '';
                            }
                        }, (error: any) => {
                            this.spinnerService.endRequest();
                            this.errorService.handleError(error.status);
                        });
                }
            }
        }
    }

    attributeValCheck(event: any) {
        if (this.attributeValMessage !== '') {
            this.attributeValMessage = '';
        }
    }

    getDetailAttribute(attrValueID: number) {
        this.isAttribute = true;
        this.productService.detailProductAttributeValue(attrValueID).
            subscribe((result: any) => {
                if (!isNullOrUndefined(result.body)) {
                    this.attrValueID = result.body.id;
                    this.pdtAttributeID.nativeElement.value = result.body.attributeID;
                    this.pdtAttributeValue.nativeElement.value = result.body.value;
                }
            }, (error: any) => {
                this.spinnerService.endRequest();
                this.errorService.handleError(error.status);
            });
    }

    deleteAttribute(attrID: number) {
        if (this.existingAttributes) {
            this.productService.deleteProductAttributeValue(attrID).subscribe((result: any) => {
                if (result.status === 1) {
                    const index: number = this.attributeValues.findIndex(x => x.id === attrID);
                    this.attributeValues.splice(index, 1);
                    this.toastr.success(this.translate.instant('common.delete'), '');
                }
            });
        }
        if (this.attributeValues.length === 0) {
            this.attributeMessage = true;
        }
    }

    listAttribute(selectedPage: number, selectedSize: number) {
        this.productService.listProductAttributeValue(this.id, '', selectedPage, selectedSize, 'ID', false).
            subscribe((result: any) => {
                if (result.status !== 1) {
                    this.errorService.handleFailure(result.statusCode);
                    this.message = this.translate.instant('common.not-found');
                    this.attributeMessage = true;
                } else if (!isNullOrUndefined(result.body)) {
                    if (!isNullOrUndefined(result.body.productAttributeValueResult)
                        && result.body.productAttributeValueResult.length > 0) {
                        this.attributeValues = [];
                        this.existingAttributes = true;
                        this.attributeMessage = false;
                        for (let i = 0; i < result.body.productAttributeValueResult.length; i++) {
                            this.attributeValues.push(result.body.productAttributeValueResult[i]);
                            this.attrID = result.body.productAttributeValueResult[0].id;
                            this.attrID++;
                        }
                        this.totalCount = result.body.totalCount;
                        this.setPage(this.currentPage);
                    }
                }
            }, (error: any) => {
                this.attributeMessage = true;
                this.errorService.handleError(error.status);
                if (error.status !== 1) {
                    this.message = this.translate.instant('common.not-present', { param: 'attribute' });
                    console.log(this.message);
                }
                this.attributeMessage = true;
            });
    }

    sizeSelect(size?: number) {
        this.pageSize = +size;
        this.listAttribute(1, this.pageSize);
    }

    pageSelect(pageNumber?: number) {
        this.currentPage = pageNumber;
        this.listAttribute(this.currentPage, this.pageSize);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
    }

    resetForm(form: NgForm) {
        form.reset();
        this.submitted = false;
        this.attributeValMessage = '';
    }

}
