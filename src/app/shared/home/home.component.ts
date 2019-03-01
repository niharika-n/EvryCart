import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { ProductModel } from '../../admin/product/product';
import { isNavigationCancelingError } from '@angular/router/src/shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // productModel: ProductModel;
  productImages = [];
  productArr = [];
  categoryArr = [];
  productImageMessage = false;
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
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

    this.homeService.getLatestCategories().
      subscribe((result: any) => {
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
