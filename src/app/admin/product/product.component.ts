import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '../../services/pagination.service';
import { ProductModel } from './product';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  model: ProductModel[];
  totalCount = 0;
  id = 0;
  message = '';
  pager: any = [];
  sortColumn = '';
  sortOrder = false;
  searchText = '';
  pageSize = 5;
  currentPage = 1;

  constructor(private productService: ProductService, private router: Router,
    private pagerService: PagerService, private toastr: ToastrService, private spinnerService: SpinnerService) { }

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
    this.productService.listing(this.searchText, selectedPage, selectedSize, 'CreatedDate', this.sortOrder).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 404) {
          this.message = 'No record found.';
        } else {
          this.model = result.productResult;
          this.totalCount = result.totalCount;
          this.setPage(this.currentPage);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.message = 'No product found';
        console.log(error);
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

  delete(id: number) {
    this.productService.delete(id).
      subscribe(() => {
        const del = confirm('Are you sure you wan to delete this product?');
        if (del) {
          this.toastr.success('Deleted successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
          this.listing('', 1, this.pageSize);
        }
      });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
  }

}
