import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryModel } from './category';
import { CategoryService } from '../../services/category.service';
import { PagerService } from '../../services/pagination.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { ErrorService } from '../../services/error.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
    model: CategoryModel[];
    totalCount = 0;
    id = 0;
    message = '';
    pager: any = [];
    sortColumn = '';
    searchText = '';
    pageSize = 5;
    currentPage = 1;
    getAll = false;
    sortOrder = false;
    constructor(private categoryService: CategoryService, private router: Router, private translate: TranslateService,
        private pagerService: PagerService, private toastr: ToastrService,
        private spinnerService: SpinnerService, private errorService: ErrorService) { }

    ngOnInit() {
        this.listing('', this.currentPage, this.pageSize);
    }

    listing(search: string, selectedPage: number, selectedSize: number) {
        this.message = '';
        this.searchText = search;
        if (isNullOrUndefined(selectedPage)) { selectedPage = this.currentPage; }
        if (isNullOrUndefined(selectedSize)) { selectedSize = this.pageSize; }
        this.spinnerService.startRequest();
        this.categoryService.Listing(this.searchText, selectedPage, selectedSize, 'CreatedDate', false, this.getAll, false).
            subscribe((result: any) => {
                this.spinnerService.endRequest();
                if (result.status !== 1) {
                    this.errorService.handleFailure(result.statusCode);
                    this.message = this.translate.instant('common.not-found');
                } else {
                    if (!isNullOrUndefined(result.body)) {
                        this.model = result.body.categoryResult;
                        this.totalCount = result.body.totalCount;
                        this.setPage(this.currentPage);
                    }
                }
            }, (error: any) => {
                this.spinnerService.endRequest();
                this.errorService.handleError(error.status);
                this.message = this.translate.instant('common.not-present', { param: 'category' });
            });
    }

    sizeSelect(size?: number) {
        this.pageSize = +size;
        this.listing(this.searchText, 1, this.pageSize);
    }

    pageSelect(pageNumber?: number) {
        this.currentPage = pageNumber;
        this.listing(this.searchText, this.currentPage, this.pageSize);
    }

    selectDirection(order: any) {
        this.sortOrder = order;
    }

    selectColumn(columnName: any) {
        this.sortColumn = columnName;
    }

    delete(id: number, productCount?) {
        const del = confirm(this.translate.instant('common.confirm-delete', { param: 'category' }));
        if (del && productCount > 0) {
            const pdtDelete = confirm(this.translate.instant('category.confirm-delete', { count: productCount }));
            if (pdtDelete) {
                this.categoryService.Delete(id).
                    subscribe((result: any) => {
                        if (result.status === 1) {
                            this.toastr.success(this.translate.instant('common.delete'), '');
                            this.listing('', 1, this.pageSize);
                        } else {
                            this.errorService.handleFailure(result.statusCode);
                            this.toastr.error(this.translate.instant('common.err-delete', { param: 'Category' }), '');
                        }
                    }, (error: any) => {
                        this.errorService.handleError(error.status);
                        this.toastr.error(this.translate.instant('common.err-delete', { param: 'Category' }), '');
                    });
            }
        } else if (del) {
            this.categoryService.Delete(id).
                subscribe((result: any) => {
                    if (result.status === 1) {
                        this.toastr.success(this.translate.instant('common.delete'), '');
                        this.listing('', 1, this.pageSize);
                    } else {
                        this.errorService.handleFailure(result.statusCode);
                        this.toastr.error(this.translate.instant('common.err-delete', { param: 'Category' }), '');
                    }
                }, (error: any) => {
                    this.errorService.handleError(error.status);
                    this.toastr.error(this.translate.instant('common.err-delete', { param: 'Category' }), '');
                });
        }
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
    }
}
