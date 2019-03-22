import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { isNullOrUndefined } from 'util';
import { ProductModel } from '../../admin/product/product';
import { isNavigationCancelingError } from '@angular/router/src/shared';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import {ErrorService} from '../../services/error.service';

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
  constructor(private homeService: HomeService, private translate: TranslateService,
    private spinnerService: SpinnerService, private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.spinnerService.startRequest();
    this.homeService.getProducts().
      subscribe((result: any) => {
        if (!isNullOrUndefined(result.body) && result.body.length > 0) {
          for (let i = 0; i < result.body.length; i++) {
            this.productArr.push(result.body[i]);
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
        if (!isNullOrUndefined(this.productArr)) {
          for (let i = 0; i < this.productArr.length; i++) {
            this.homeService.getProductImages(this.productArr[i].productID)
              .subscribe((imageResult: any) => {
                this.spinnerService.endRequest();
                if (!isNullOrUndefined(imageResult.body)) {
                  this.productImages.push({
                    id: imageResult.id,
                    src: 'data:image/png;base64,' + imageResult.body.imageContent,
                    heading: this.productArr[i].productName,
                    description: this.productArr[i].shortDescription
                  });
                }
              }, (error: any) => {
                this.spinnerService.endRequest();
                this.errorService.handleError(error.status);
                const message = this.translate.instant('product.image-present');
                console.log(message);
              });
          }
        }
      });

    this.spinnerService.startRequest();
    this.homeService.getLatestCategories().
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (!isNullOrUndefined(result.body) && result.body.length > 0) {
          for (let i = 0; i < result.body.length; i++) {
            this.categoryArr.push({
              imageContent: 'data:image/png;base64,' + result.body[i].imageContent,
              categoryValue: result.body[i]
            });
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
        console.log(error);
      });
  }
}
