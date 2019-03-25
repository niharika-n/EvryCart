import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { SigninService } from '../../services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  submitted = false;
  error = '';
  constructor(private router: Router, private toastr: ToastrService, private errorService: ErrorService,
    private loginService: SigninService, private translate: TranslateService) { }

  ngOnInit() { }

  changePassword(form: NgForm) {
    if (form.valid) {
      this.loginService.forgotPassword(form.value.username).
        subscribe((result: any) => {
          if (result.status === 1) {
            this.toastr.success(this.translate.instant('common.link-sent'), '');
          } else {
            this.errorService.handleFailure(result.statusCode);
          }
        }, (error: any) => {
          this.errorService.handleError(error.status);
          this.error = this.translate.instant('common.not-exist', { param: 'email address' });
        });
    }
    this.submitted = true;
  }

  enterEmail(event: any) {
    if (this.error !== '') {
      this.error = '';
    }
  }

}
