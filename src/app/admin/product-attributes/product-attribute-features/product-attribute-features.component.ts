import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductAttributeService } from '../../../services/product-attributes.service';
import { ProductAttributeModel } from '../product-attribute';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-attribute-features',
  templateUrl: './product-attribute-features.component.html',
  styleUrls: ['./product-attribute-features.component.css']
})
export class ProductAttributeFeaturesComponent implements OnInit {
  model: ProductAttributeModel;
  form: FormGroup;
  submitted = false;
  loading = false;
  pageTitle = '';
  id = 0;
  nameCheckMessage = '';

  constructor(private attributeService: ProductAttributeService, private builder: FormBuilder, private translate: TranslateService,
    private route: ActivatedRoute, private toastr: ToastrService, private spinnerService: SpinnerService) {
    this.model = {
      attributeID: 0,
      attributeName: '',
      createdBy: 0,
      createdDate: null,
      createdUser: ''
    };
  }
  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.spinnerService.startRequest();
      this.attributeService.detail(this.id)
        .subscribe((result: any) => {
          this.spinnerService.endRequest();
          this.pageTitle = this.translate.instant('attribute-detail.edit');
          this.model = result.body;
        });
    } else {
      this.pageTitle = this.translate.instant('attribute-detail.add');
    }
  }

  attributeNameCheck(event: any) {
    if (this.nameCheckMessage !== '') {
      this.nameCheckMessage = '';
    }
  }

  add(form: NgForm) {
    if (form.valid) {
      if (this.id) {
        this.attributeService.update(form.value).subscribe((result: any) => {
          if (!isNullOrUndefined(result.body.attribute)) {
            this.toastr.success(this.translate.instant('common.update', { param: 'Attribute' }), '');
          }
          if (!isNullOrUndefined(result.body.message)) {
            this.nameCheckMessage = this.translate.instant('attribute.present');
          } else {
            this.nameCheckMessage = '';
          }
        });
      } else {
        this.attributeService.add(form.value).subscribe((result: any) => {
          if (!isNullOrUndefined(result.body.attribute)) {
            this.toastr.success(this.translate.instant('common.insert', { param: 'Attribute' }), '');
            this.resetForm(form);
          }
          if (!isNullOrUndefined(result.body.message)) {
            this.nameCheckMessage = this.translate.instant('attribute.present');
          } else {
            this.nameCheckMessage = '';
          }
        });
      }
    }
    this.submitted = true;
  }

  resetForm(form: NgForm) {
    form.reset();
    if (this.id) {
      this.pageStart();
    }
    this.submitted = false;
  }

}
