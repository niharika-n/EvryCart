import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { ProductService } from '../../../../services/product.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.css']
})
export class ProductImagesComponent implements OnInit {
  id = 0;
  imgID = 0;
  message = '';
  imageMessage = false;
  isImage = false;
  existingImages = false;
  urls = [];
  imageObj = [];
  selectedImg = [];

  constructor(private productService: ProductService, private translate: TranslateService,
    private route: ActivatedRoute, private spinnerService: SpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    if (this.id === 0) {
      this.id = +this.route.snapshot.paramMap.get('id');
      this.getImageList();
    }
  }

  showImageForm() {
    if (!this.isImage) {
      this.isImage = true;
    } else {
      this.isImage = false;
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImg.push({ id: this.imgID + i, src: e.target.result, value: event.target.files[i] });
        };
        this.imageMessage = false;
        reader.readAsDataURL(event.target.files[i]);
      }
      this.existingImages = true;
    }
  }

  deleteImage(imgID: number) {
    if (!this.existingImages) {
      this.productService.deleteProductImage(this.id, imgID).subscribe((data: any) => {
        if (data === 'image deleted') {
          const index: number = this.urls.findIndex(x => x.id === imgID);
          this.urls.splice(index, 1);
          this.toastr.success(this.translate.instant('common.delete'), '');
          if (this.urls.length === 0) {
            this.imageMessage = true;
          }
        }
      });
    } else {
      const index: number = this.selectedImg.findIndex(x => x.id === imgID);
      this.selectedImg.splice(index, 1);
    }
  }

  addImages() {
    if (this.selectedImg.length > 0) {
      for (let i = 0; i < this.selectedImg.length; i++) {
        this.imageObj.push(this.selectedImg[i].value);
      }
      this.selectedImg = [];
      this.existingImages = false;
      if (!isNullOrUndefined(this.imageObj) && this.imageObj.length > 0) {
        const currentUser = JSON.parse(localStorage.getItem('token'));
        const body = JSON.stringify(this.id);
        const formData = new FormData();
        formData.append('productID', body);
        for (const i in this.imageObj) {
          if (this.imageObj[i] !== null) {
            formData.append('file', this.imageObj[i]);
          }
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/product/addProductImages');
        xhr.setRequestHeader('Authorization', `Bearer ${currentUser}`);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              this.toastr.success(this.translate.instant('common.insert', { param: 'Images' }), '');
              this.getImageList();
            }
          }
        };
        xhr.send(formData);
      }
    }
  }

  getImageList() {
    this.isImage = false;
    this.spinnerService.startRequest();
    this.productService.listProductImages(this.id).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.productImageResult.length > 0 && !isNullOrUndefined(result.productImageResult)) {
          this.imageMessage = false;
          this.urls = [];
          Object.keys(result.productImageResult).forEach((elt) => {
            this.urls.push({
              id: result.productImageResult[elt].id,
              src: 'data:image/png;base64,' + result.productImageResult[elt].imageContent
            });
          });
        } else {
          this.imageMessage = true;
        }
      }, (error: any) => {
        if (error.status === 404) {
          this.message = this.translate.instant('product.image-present');
          console.log(this.message);
        }
        this.imageMessage = true;
      });
  }


}
