import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductAttributeService } from '../../../../services/product-attributes.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../../../services/product.service';
import { ProductAttributeValueModel } from '../../product-attribute-value';
import { PagerService } from '../../../../services/pagination.service';

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
    @ViewChild('AttributeID') AttributeID: ElementRef;
    @ViewChild('AttributeValue') AttributeValue: ElementRef;
    totalCount = 0;
    pager: any = [];
    pageSize = 4;
    currentPage = 1;
    attributeValMessage = '';
    submitted = false;

    constructor(private productService: ProductService, private route: ActivatedRoute, private pagerService: PagerService,
        private toastr: ToastrService, private attributeservice: ProductAttributeService) {
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
        this.attributeservice.listing('', 1, 5, new Date(), false, true).
            subscribe((result: any) => {
                if (result.status === 404) {
                    this.message = 'No record found.';
                } else {
                    this.AttributeArr = result;
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
                        if (!isNullOrUndefined(result.attributeVal)) {
                            this.toastr.success('Added successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
                            this.listAttribute(1, this.pageSize);
                            this.isAttribute = true;
                            this.resetForm(form);
                        }
                        if (!isNullOrUndefined(result.message)) {
                            this.attributeValMessage = 'This attribute value already exists';
                        } else {
                            this.attributeValMessage = '';
                        }
                    });
            } else {
                this.model = ({
                    id: this.attrValueID, attributeID: Number(attrID),
                    productID: this.id, value: attrValue
                });
                if (!isNullOrUndefined(this.model)) {
                    this.productService.updateProductAttributeValue(this.model).
                        subscribe((result: any) => {
                            if (!isNullOrUndefined(result.attributeVal)) {
                                this.toastr.success('Updated successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
                                this.listAttribute(1, this.pageSize);
                                this.isAttribute = false;
                            }
                            if (!isNullOrUndefined(result.message)) {
                                this.attributeValMessage = 'This attribute value already exists';
                            } else {
                                this.attributeValMessage = '';
                            }
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
                this.attrValueID = result.id;
                this.AttributeID.nativeElement.value = result.attributeID;
                this.AttributeValue.nativeElement.value = result.value;
            });
    }

    deleteAttribute(attrID: number) {
        if (this.existingAttributes) {
            this.productService.deleteProductAttributeValue(attrID).subscribe((data: any) => {
                if (data === 'attribute deleted') {
                    const index: number = this.attributeValues.findIndex(x => x.id === attrID);
                    this.attributeValues.splice(index, 1);
                    this.toastr.success('Deleted successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
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
                if (result.status === 404) {
                    this.message = 'No record found.';
                    this.attributeMessage = true;
                } else if (!isNullOrUndefined(result.productAttributeValueResult) && result.productAttributeValueResult.length > 0) {
                    this.attributeValues = [];
                    this.existingAttributes = true;
                    this.attributeMessage = false;
                    for (let i = 0; i < result.productAttributeValueResult.length; i++) {
                        this.attributeValues.push(result.productAttributeValueResult[i]);
                        this.attrID = result.productAttributeValueResult[0].id;
                        this.attrID++;
                    }
                    this.totalCount = result.totalCount;
                    this.setPage(this.currentPage);
                }
            }, (error: any) => {
                this.attributeMessage = true;
                if (error.status === 404) {
                    this.message = 'No Attributes present';
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
        debugger;
        this.submitted = false;
        this.attributeValMessage = '';
        form.reset();
    }

}
