import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '../../services/pagination.service';
import { ToastrService } from 'ngx-toastr';
import { ProductAttributeService } from '../../services/product-attributes.service';
import { ProductAttributeModel } from './product-attribute';
import { SpinnerService } from 'src/app/services/spinner.service';

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

  constructor(private router: Router, private pagerService: PagerService,
    private toastr: ToastrService, private productAttributeService: ProductAttributeService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.listing('', this.currentPage, this.pageSize);
  }

  listing(search: string, selectedPage: number, selectedSize: number) {
    this.message = '';
    this.searchText = search;
    if (this.sortColumn === '') {
      this.sortColumn = 'CreatedDate';
    }
    this.spinnerService.startRequest();
    this.productAttributeService.listing(this.searchText, selectedPage, selectedSize, 'CreatedDate', this.sortOrder, false).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 404) {
          this.message = 'No record found.';
        } else {
          this.model = result.productAttributeResult;
          this.totalCount = result.totalCount;
          this.setPage(this.currentPage);
        }
      }, (error: any) => {
        this.message = 'No attribute found';
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
    const del = confirm('Are you sure you want to delete this Attribute?');
    if (del && attrValueCount > 0) {
      const result = confirm('This attribute has ' + attrValueCount + ' value(s) in various Products. Do you want to proceed ?');
      if (result) {
        this.productAttributeService.delete(id).
          subscribe(() => {
            this.toastr.success('Deleted successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
            this.listing('', 1, this.pageSize);
          });
      }
    } else if (del) {
      this.productAttributeService.delete(id).
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
