import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { LoginUser } from '../../shared/login-model';
import { SettingsService } from '../../services/settings.service';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  userImg = '';
  user: LoginUser;
  submitted = false;
  fileSelected = false;
  id = 0;
  url = '';
  imageObj = null;
  @ViewChild('imagePath') imagePath: ElementRef;
  existingUsername = '';
  existingEmail = '';

  constructor(private formbuilder: FormBuilder, private settingsService: SettingsService,
    private toastr: ToastrService, private spinnerService: SpinnerService, private translate: TranslateService) {
    this.settingsForm = this.formbuilder.group({
      userID: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
    });
  }

  get model() { return this.settingsForm.controls; }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.id = this.user.userID;
    this.spinnerService.startRequest();
    this.settingsService.Detail(this.id).subscribe((result: any) => {
      this.spinnerService.endRequest();
      if (!isNullOrUndefined(result.body)) {
      this.user = result.body;
      if (result.body.imageContent != null) {
        this.userImg = 'data:image/png;base64,' + result.body.imageContent;
        this.fileSelected = true;
      }
    }
      this.formValue();
    });
  }

  formValue() {
    this.settingsForm.patchValue({
      userID: this.user.userID,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      username: this.user.username,
      emailID: this.user.emailID
    });
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

  submitForm(formValue: FormGroup) {
    if (formValue.valid) {
      const currentUser = JSON.parse(localStorage.getItem('token'));
      const body = JSON.stringify(formValue.value);
      const formData = new FormData();
      formData.append('model', body);
      if (this.imageObj !== null) {
        formData.append('file', this.imageObj);
      }
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', '/api/user/update');
      xhr.setRequestHeader('accept', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${currentUser}`);
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.response.message === 'usernameMessage') {
            this.existingUsername = this.translate.instant('register-user.username-exists');
          } else {
            this.existingUsername = '';
          }
          if (xhr.response.message === 'emailMessage') {
            this.existingEmail = this.translate.instant('register-user.email-exists');
          } else {
            this.existingEmail = '';
          }
          if (xhr.status === 200) {
            if (xhr.response.status === 1) {
              localStorage.removeItem('user');
              localStorage.setItem('user', JSON.stringify(xhr.response.body));
              this.toastr.success(this.translate.instant('common.update', { param: 'Settings' }), '');
            }
          }
        }
      };
      xhr.send(formData);

    }
    this.submitted = true;
  }

  resetForm(form: NgForm) {
    if (form != null) {
      this.fileSelected = false;
      this.submitted = false;
      this.url = '';
      this.pageStart();
      this.imagePath.nativeElement.value = '';
    }
  }
}
