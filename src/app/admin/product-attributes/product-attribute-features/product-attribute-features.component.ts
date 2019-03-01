import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductAttributeService } from '../../../services/product-attributes.service';
import { ProductAttributeModel } from '../product-attribute';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';

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

  constructor(private attributeService: ProductAttributeService, private builder: FormBuilder,
    private route: ActivatedRoute, private toastr: ToastrService) {
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
      this.attributeService.detail(this.id)
        .subscribe((result: any) => {
          this.pageTitle = 'Edit';
          this.model = result;
        });
    } else {
      this.pageTitle = 'Add';
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
          if (!isNullOrUndefined(result.attribute)) {
            this.toastr.success('Updated successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
          }
        });
      } else {
        this.attributeService.add(form.value).subscribe((result: any) => {
          if (!isNullOrUndefined(result.attribute)) {
            this.toastr.success('Added successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
          this.resetForm(form);
          }
          if (!isNullOrUndefined(result.message)) {
            this.nameCheckMessage = 'Attribute field exists already';
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
