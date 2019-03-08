import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { LoginUser } from '../../shared/login-model';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent implements OnInit {
  adminForm: FormGroup;
  user: LoginUser;
  submitted = false;
  id = 0;
  url = '';
  fileSelected = false;
  imageObj = null;
  existingUsername = '';
  existingEmail = '';
  rolesArray = [
    { key: 'Admin', value: '2', selected: false },
    { key: 'User', value: '3', selected: true }
  ];
  selectedRole = false;
  userRoles: any = [];
  @ViewChild('imagePath') imagePath: ElementRef;

  constructor(private toastr: ToastrService, private formbuilder: FormBuilder) {
    this.adminForm = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]]
      //  roleID: this.formbuilder.array([])
    });
  }

  ngOnInit() {
    const preSelectedValue = this.rolesArray.find(x => x.selected === true).value;
    this.onChange(preSelectedValue, true);
  }

  onChange(value: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedRole = true;
      if (value !== null) {
        this.userRoles.push(value);
      }
    } else {
      const index = this.userRoles.indexOf(value);
      this.userRoles.splice(index, 1);
    }
    if (this.userRoles.length === 0) {
      this.selectedRole = false;
    }
  }

  get model() { return this.adminForm.controls; }

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

  CreateAdmin(form: FormGroup, file: File) {
    if (form.valid) {
      if (this.fileSelected) {
        const currentUser = JSON.parse(localStorage.getItem('token'));
        const body = JSON.stringify(form.value);
        // const roles = ('[').concat(this.userRoles).concat(']');
        const formData = new FormData();
        formData.append('model', body);
        formData.append('file', this.imageObj);
        formData.append('role', JSON.stringify(this.userRoles));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/user/createuser');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${currentUser}`);
        xhr.responseType = 'json';
        xhr.onreadystatechange = (result: any) => {
          if (xhr.readyState === 4) {
            debugger;
            if (!isNullOrUndefined(xhr.response.usernameMessage)) {
              this.existingUsername = 'Username already exists';
            } else {
              this.existingUsername = '';
            }
            if (!isNullOrUndefined(xhr.response.emailMessage)) {
              this.existingEmail = 'Email Address already exists';
            } else {
              this.existingEmail = '';
            }
            if (xhr.status === 200) {
              debugger;
              if (!isNullOrUndefined(xhr.response.user)) {
                this.toastr.success('User Created !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
                this.resetForm(form);
              }
            }
          }
        };
        xhr.send(formData);
      }
    }
    this.submitted = true;
  }

  resetForm(form: FormGroup) {
    if (form != null) {
      this.fileSelected = false;
      this.submitted = false;
      this.selectedRole = false;
      this.userRoles = [];
      this.url = '';
      this.existingEmail = '';
      this.existingUsername = '';
      this.imagePath.nativeElement.value = '';
    }
  }
}

