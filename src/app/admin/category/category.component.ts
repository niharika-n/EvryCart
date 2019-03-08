import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryModel } from './category';
import { CategoryService } from '../../services/category.service';
import { PagerService } from '../../services/pagination.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';

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
    constructor(private categoryService: CategoryService, private router: Router,
        private pagerService: PagerService, private toastr: ToastrService,
        private spinnerService: SpinnerService) { }

    ngOnInit() {
        this.listing('', this.currentPage, this.pageSize);
    }

    listing(search: string, selectedPage: number, selectedSize: number) {
        this.message = '';
        this.searchText = search;
        this.spinnerService.startRequest();
        this.categoryService.Listing(this.searchText, selectedPage, selectedSize, 'CreatedDate', false, this.getAll, false).
            subscribe((result: any) => {
               this.spinnerService.endRequest();
                if (result.status === 404) {
                    this.message = 'No record found.';
                } else {
                    this.model = result.categoryResult;
                    this.totalCount = result.totalCount;
                    this.setPage(this.currentPage);
                }
            }, (error: any) => {
                this.spinnerService.endRequest();
                this.message = 'No category found';
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
        const del = confirm('Are you sure you want to delete this Category?');
        if (del && productCount > 0) {
            const result = confirm('This category has ' + productCount + ' product(s). Do you want to proceed ?');
            if (result) {
                this.categoryService.Delete(id).
                    subscribe(() => {
                        this.toastr.success('Deleted successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
                        this.listing('', 1, this.pageSize);
                    });
            }
        } else if (del) {
            this.categoryService.Delete(id).
                subscribe(() => {
                    this.toastr.success('Deleted successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
                    this.listing('', 1, this.pageSize);
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
