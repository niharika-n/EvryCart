import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { LoginUser } from '../../shared/login-model';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  isReset = false;
  url = '';
  imageObj = null;
  fileSelected = false;
  selectedUser: LoginUser[];
  existingUsername = '';
  existingEmail = '';
  pattern = /^[a-z]/;
  @ViewChild('imageContent') imageFile: ElementRef;

  constructor(
    private registerService: RegisterService, private formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit() { }

  EmailCheck(event: any) {
    if (this.existingEmail !== '') {
      this.existingEmail = '';
    }
  }
  UsernameCheck(event: any) {
    if (this.existingUsername !== '') {
      this.existingUsername = '';
    }
  }

  submitForm(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      console.log(form.value);
      const body = JSON.stringify(form.value);
      const formData = new FormData();
      formData.append('model', body);
      formData.append('file', this.imageObj);
      formData.append('role', '[3]');
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/user/createuser');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.responseType = 'json';
      xhr.onreadystatechange = (result: any) => {
        if (xhr.readyState === 4) {
          if (!isNullOrUndefined(xhr.response.usernameMessage)) {
            this.existingUsername = this.translate.instant('register-user.object-exists', { param: 'Username' });
          } else {
            this.existingUsername = '';
          }
          if (!isNullOrUndefined(xhr.response.emailMessage)) {
            this.existingEmail = this.translate.instant('register-user.object-exists', { param: 'email address' });
          } else {
            this.existingEmail = '';
          }
          if (xhr.status === 200) {
            if (!isNullOrUndefined(xhr.response.success)) {
              console.log(xhr.response.success);
              this.toastr.success(this.translate.instant('common.create', { param: 'User' }), '');
              this.resetForm(form);
              this.router.navigate(['/login']);
            }
            if (!isNullOrUndefined(xhr.response.fail)) {
              this.toastr.error(this.translate.instant('common.err-create', { param: 'User' }), '');
              this.resetForm(form);
            }
          }
        }
      };
      xhr.send(formData);
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.url = e.target.result;
      };
      this.fileSelected = true;
    }
    this.imageObj = event.target.files[0];
  }

  resetForm(form: NgForm) {
    if (form != null) {
      form.reset();
      this.fileSelected = false;
      this.submitted = false;
      this.url = '';
      this.imageFile.nativeElement.value = '';
      this.existingEmail = '';
      this.existingUsername = '';
    }
    this.registerService.selectedUser = {
      userID: null,
      firstName: '',
      lastName: '',
      username: '',
      imageContent: '',
      emailID: '',
      roleID: null
    };
  }
}
