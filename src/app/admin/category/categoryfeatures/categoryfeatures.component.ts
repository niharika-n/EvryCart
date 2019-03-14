import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { CategoryService } from '../../../services/category.service';
import { CategoryModel } from '../category';
import { isNullOrUndefined } from 'util';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-categoryfeatures',
  templateUrl: './categoryfeatures.component.html',
  styleUrls: ['./categoryfeatures.component.css']
})
export class CategoryfeaturesComponent implements OnInit {
  model: CategoryModel;
  CategoryArr: any[];
  submitted = false;
  loading = false;
  pageTitle = '';
  id = 0;
  url = '';
  imageObj = null;
  showChild = false;
  message = '';
  editPage = false;
  @ViewChild('imagePath') imagePath: ElementRef;
  categoryCheckMessage = '';

  constructor(private categoryService: CategoryService, private toastr: ToastrService, private translate: TranslateService,
    private router: Router, private activatedRoute: ActivatedRoute, private spinnerService: SpinnerService) {
    this.model = {
      categoryID: 0,
      categoryName: '',
      categoryDescription: '',
      isActive: false,
      createdBy: 0,
      createdDate: null,
      createdUser: '',
      parentCategory: true,
      childCategory: null,
      imageContent: null,
      imageID: 0,
    };
  }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.editPage = true;
      this.spinnerService.startRequest();
      this.categoryService.Detail(this.id)
        .subscribe((result: any) => {
          this.spinnerService.endRequest();
          this.pageTitle = this.translate.instant('category-detail.edit');
          this.model = result.body;
          if (!this.model.parentCategory) { this.showChild = true; }
          if (result.body.imageContent !== null) {
            this.model.imageContent = 'data:image/png;base64,' + result.body.imageContent;
          }
        });
    } else {
      this.editPage = false;
      this.pageTitle = this.translate.instant('category-detail.add');
    }
    this.getCategoryList();
  }

  SelectChild() {
    if (!this.model.parentCategory) {
      this.showChild = true;
    } else {
      this.showChild = false;
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.model.imageContent !== null) {
        this.model.imageContent = null;
        this.model.imageID = null;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.url = e.target.result;
      };
    }
    this.imageObj = event.target.files[0];
  }

  getCategoryList() {
    this.categoryService.Listing('', 1, 5, this.model.createdDate, false, true, false).
      subscribe((result: any) => {
        if (result.status === 404) {
          this.message = this.translate.instant('common.not-found');
        } else {
          this.CategoryArr = result;
        }
      });
  }

  add(form: NgForm) {
    if (form.valid) {
      const currentUser = JSON.parse(localStorage.getItem('token'));
      const body = JSON.stringify(form.value);
      const formData = new FormData();
      formData.append('category', body);
      if (this.imageObj !== null) {
        formData.append('file', this.imageObj);
      }
      const xhr = new XMLHttpRequest();
      if (this.id) {
        xhr.open('PUT', '/api/category/updatecategory');
      } else {
        xhr.open('POST', '/api/category/insertcategory');
      }
      xhr.setRequestHeader('accept', 'application/json');
      xhr.responseType = 'json';
      xhr.setRequestHeader('Authorization', `Bearer ${currentUser}`);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (!isNullOrUndefined(xhr.response.body.message)) {
            this.categoryCheckMessage = xhr.response.body.message;
          } else {
            this.categoryCheckMessage = '';
          }
          if (!isNullOrUndefined(xhr.response.body.categoryObj)) {
            if (this.id) {
              this.toastr.success(this.translate.instant('common.update', { param: 'Category' }), '');
            } else {
              this.toastr.success(this.translate.instant('common.insert', { param: 'Category' }), '');
            }
            this.resetForm(form);
          }
        }
      };
      xhr.send(formData);
    }
    this.submitted = true;
  }

  nameCheck(event: any) {
    if (this.categoryCheckMessage !== '') {
      this.categoryCheckMessage = '';
    }
  }

  deleteImage() {
    this.url = '';
    this.imagePath.nativeElement.value = '';
    if (this.model.imageContent !== null) {
      this.model.imageContent = null;
      this.model.imageID = null;
    }
  }

  resetForm(form: NgForm) {
    form.reset();
    if (this.id) {
      this.pageStart();
    }
    if (form != null) {
      this.pageStart();
      this.url = '';
      this.imagePath.nativeElement.value = '';
      this.showChild = false;
    }
    this.submitted = false;
  }

}
