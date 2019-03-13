import { Component, OnInit, Directive } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.css']
})
export class AdminChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  submitted = false;
  wrongPassword = false;
  passwordMatchCheck = false;
  constructor(private settingsService: SettingsService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private translate: TranslateService) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^[a-z]/)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  get model() { return this.passwordForm.controls; }

  oldPasswordCheck(event: any) {
    if (this.wrongPassword === true) {
      this.wrongPassword = false;
    }
  }

  newPasswordConfirm(event: any) {
    if (this.passwordMatchCheck === true) {
      this.passwordMatchCheck = false;
    }
  }

  changePassword(form: FormGroup) {
    if (form.valid) {
      if (form.value.newPassword !== form.value.confirmPassword) {
        this.passwordMatchCheck = true;
      } else {
        this.settingsService.changePassword(form.value.oldPassword, form.value.newPassword).
          subscribe((result: any) => {
            this.toastr.success(this.translate.instant('common.update'), '');
          }, (error: any) => {
            this.wrongPassword = true;
            this.toastr.error(this.translate.instant('common.err-update'), '');
          });
      }
    }
    this.submitted = true;
  }

  resetForm(form: NgForm) {
    if (form != null) {
      this.submitted = false;
      this.wrongPassword = false;
    }
  }
}
