import { Component, OnInit } from '@angular/core';
import { SigninService } from '../../services/login.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  wrongPassword = false;
  passwordMatchCheck = false;
  token = '';
  badRequestMessage = '';
  constructor(private loginService: SigninService, private formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^[a-z]/)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.token = this.activatedRoute.snapshot.paramMap.get('id');
    this.loginService.validateToken(this.token).
      subscribe((result: any) => {
      }, (error: any) => {
        this.badRequestMessage = this.translate.instant('password.invalid-link');
      });
  }

  get model() { return this.resetPasswordForm.controls; }

  newPasswordConfirm(event: any) {
    if (this.passwordMatchCheck === true) {
      this.passwordMatchCheck = false;
    }
  }

  submitPassword(form: FormGroup) {
    if (form.valid) {
      if (form.value.newPassword !== form.value.confirmPassword) {
        this.passwordMatchCheck = true;
      } else {
        this.loginService.resetPassword(this.token, form.value.newPassword).
          subscribe((result: any) => {
            if (!isNullOrUndefined(result.success)) {
              this.toastr.success(this.translate.instant('common.update', { param: 'Password' }), '');
              this.router.navigate(['/login']);
            }
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
      this.pageStart();
    }
  }
}



