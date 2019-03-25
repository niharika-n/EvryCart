import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '../../services/pagination.service';
import { ToastrService } from 'ngx-toastr';
import { ProductAttributeService } from '../../services/product-attributes.service';
import { ProductAttributeModel } from './product-attribute';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.css']
})
export class ProductAttributesComponent implements OnInit {
  model: ProductAttributeModel[];
  totalCount = 0;
  id = 0;
  message = '';
  pager: any = [];
  sortColumn = '';
  sortOrder = false;
  searchText = '';
  pageSize = 5;
  currentPage = 1;

  constructor(private router: Router, private pagerService: PagerService, private translate: TranslateService,
    private toastr: ToastrService, private productAttributeService: ProductAttributeService,
    private spinnerService: SpinnerService, private errorService: ErrorService) { }

  ngOnInit() {
    this.listing('', this.currentPage, this.pageSize);
  }

  listing(search: string, selectedPage: number, selectedSize: number) {
    this.message = '';
    this.searchText = search;
    if (isNullOrUndefined(selectedPage)) { selectedPage = this.currentPage; }
    if (isNullOrUndefined(selectedSize)) { selectedSize = this.pageSize; }
    if (this.sortColumn === '') {
      this.sortColumn = 'CreatedDate';
    }
    this.spinnerService.startRequest();
    this.productAttributeService.listing(this.searchText, selectedPage, selectedSize, 'CreatedDate', this.sortOrder, false).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status !== 1) {
          this.errorService.handleFailure(result.statusCode);
          this.message = this.translate.instant('common.not-found');
        } else {
          if (!isNullOrUndefined(result.body)) {
            this.model = result.body.productAttributeResult;
            this.totalCount = result.body.totalCount;
            this.setPage(this.currentPage);
          }
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
        this.message = this.translate.instant('common.not-present', { param: 'attribute' });
      });
  }

  selectDirection(order: any) {
    this.sortOrder = order;
  }

  selectColumn(columnName: any) {
    this.sortColumn = columnName;
  }

  sizeSelect(size?: number) {
    this.pageSize = +size;
    this.listing(this.searchText, 1, this.pageSize);
  }

  pageSelect(pageNumber?: number) {
    this.currentPage = pageNumber;
    this.listing(this.searchText, this.currentPage, this.pageSize);
  }

  delete(id: number, attrValueCount?) {
    const del = confirm(this.translate.instant('common.confirm-delete', { param: 'Attribute' }));
    if (del && attrValueCount > 0) {
      const delValues = confirm(this.translate.instant('attribute.confirm-delete', { param: attrValueCount }));
      if (delValues) {
        this.productAttributeService.delete(id).
          subscribe((result: any) => {
            if (result.status === 1) {
              this.toastr.success(this.translate.instant('common.delete'), '');
              this.listing('', 1, this.pageSize);
            } else {
              this.errorService.handleFailure(result.statusCode);
              this.message = this.translate.instant('common.err-delete', { param: 'Attribute' });
            }
          }, (error: any) => {
            this.spinnerService.endRequest();
            this.errorService.handleError(error.status);
            this.message = this.translate.instant('common.not-present', { param: 'attribute' });
          });
      }
    } else if (del) {
      this.productAttributeService.delete(id).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.toastr.success(this.translate.instant('common.delete'), '');
            this.listing('', 1, this.pageSize);
          } else {
            this.errorService.handleFailure(result.statusCode);
            this.message = this.translate.instant('common.err-delete', { param: 'Attribute' });
          }
        }, (error: any) => {
          this.spinnerService.endRequest();
          this.errorService.handleError(error.status);
          this.message = this.translate.instant('common.not-present', { param: 'attribute' });
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
