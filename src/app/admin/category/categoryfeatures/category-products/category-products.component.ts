import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { CategoryService } from '../../../../services/category.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { PagerService } from '../../../../services/pagination.service';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  id = 0;
  productMessage = false;
  ProductsArr = [];
  pager: any = [];
  pageSize = 4;
  currentPage = 1;
  totalCount = 0;

  constructor(private categoryService: CategoryService, private builder: FormBuilder, private translate: TranslateService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private productService: ProductService, private toastr: ToastrService,
    private pagerService: PagerService, private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.getProducts(1, this.pageSize);
  }

  getProducts(selectedPage: number, selectedSize: number) {
    this.spinnerService.startRequest();
    this.categoryService.getProducts(this.id, '', selectedPage, selectedSize, 'ProductName', false).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        this.productMessage = false;
        if (result.productResult.length > 0) {
          for (let i = 0; i < result.productResult.length; i++) {
            this.ProductsArr.push(result.productResult[i]);
          }
          this.totalCount = result.totalCount;
          this.setPage(this.currentPage);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.productMessage = true;
        console.log(this.translate.instant('category.null-product'));
      });
  }

  getDetailProduct(pdtID: number) {
    this.router.navigate(['admin/product/detail/' + pdtID]);
  }

  deleteProduct(pdtID: number) {
    const del = confirm(this.translate.instant('common.confirm-delete', { object: 'product' }));
    if (del) {
      this.productService.delete(pdtID).
        subscribe(() => {
          const index: number = this.ProductsArr.findIndex(x => x.id === pdtID);
          this.ProductsArr.splice(index, 1);
          this.toastr.success(this.translate.instant('common.delete'), '', { positionClass: 'toast-top-right', timeOut: 5000 });
        });
    }
  }

  sizeSelect(size?: number) {
    this.pageSize = +size;
    this.getProducts(1, this.pageSize);
  }

  pageSelect(pageNumber?: number) {
    this.currentPage = pageNumber;
    this.getProducts(this.currentPage, this.pageSize);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
  }
}
