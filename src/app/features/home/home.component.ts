import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { ProductModel } from '../../admin/product/product';
import { isNavigationCancelingError } from '@angular/router/src/shared';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productImages = [];
  productArr = [];
  categoryArr = [];
  productImageMessage = false;
  constructor(private homeService: HomeService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.spinnerService.startRequest();
    this.homeService.getProducts().
      subscribe((result: any) => {
        if (!isNullOrUndefined(result) && result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            this.productArr.push(result[i]);
          }
        }
        if (!isNullOrUndefined(this.productArr)) {
          for (let i = 0; i < this.productArr.length; i++) {
            this.homeService.getProductImages(this.productArr[i].productID)
              .subscribe((imageResult: any) => {
                this.spinnerService.endRequest();
                if (!isNullOrUndefined(imageResult)) {
                  this.productImages.push({
                    id: imageResult.id,
                    src: 'data:image/png;base64,' + imageResult.imageContent,
                    heading: this.productArr[i].productName,
                    description: this.productArr[i].shortDescription
                  });
                }
              }, (error: any) => {
                const message = 'Product Image does not exist';
                console.log(message);
              });
          }
        }
      });

    this.spinnerService.startRequest();
    this.homeService.getLatestCategories().
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (!isNullOrUndefined(result) && result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            this.categoryArr.push({
              imageContent: 'data:image/png;base64,' + result[i].imageContent,
              categoryValue: result[i]
            });
          }
        }
      }, (error: any) => {
        console.log(error);
      });
  }
}
