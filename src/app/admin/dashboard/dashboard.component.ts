import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ProductArr = [];
  CategoryArr = [];
  statistics: any;
  categoryUpdateDate: Date;
  productUpdateDate: Date;

  constructor(private dashboardService: DashboardService, private router: Router, private spinnerService: SpinnerService) {
    this.statistics = {
      categoryCount: 0,
      productCount: 0
    };
  }

  ngOnInit() {
    this.dashboard();
  }

  dashboard() {
    this.spinnerService.startRequest();
    this.dashboardService.getStatistics().
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (!isNullOrUndefined(result.body)) {
        this.statistics.categoryCount = result.body.categoryCount;
        this.statistics.productCount = result.body.productCount;
        this.categoryUpdateDate = result.body.categoryLastUpdated;
        this.productUpdateDate = result.body.productLastUpdated;
        if (result.body.categoryResult.length > 0) {
          for (let i = 0; i < result.body.categoryResult.length; i++) {
            this.CategoryArr.push(result.body.categoryResult[i]);
          }
        }
        if (result.body.productResult.length > 0) {
          for (let i = 0; i < result.body.productResult.length; i++) {
            this.ProductArr.push(result.body.productResult[i]);
          }
        }
      }
      });
  }

  getCategoryDetail(categoryID: number) {
    if (categoryID !== 0) {
      this.router.navigate(['admin/category/detail/' + categoryID]);
    }
  }

  getProductDetail(prodcutID: number) {
    if (prodcutID !== 0) {
      this.router.navigate(['admin/product/detail/' + prodcutID]);
    }
  }
}
