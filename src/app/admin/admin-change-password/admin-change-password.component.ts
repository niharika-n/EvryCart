import { Component, OnInit, Directive } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private settingsService: SettingsService, private formBuilder: FormBuilder, private toastr: ToastrService) {
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
            this.toastr.success('Updated successfully !', '', { positionClass: 'toast-top-right', timeOut: 5000 });
          }, (error: any) => {
            this.wrongPassword = true;
            console.log(error);
          });
      }
    }
    this.submitted = true;
  }

  resetForm(form: NgForm) {
    if (form != null) {
      this.submitted = false;
      this.wrongPassword = false;
      this.ngOnInit();
    }
  }
}
