import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { SigninService } from '../../services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  submitted = false;
  error = '';
  constructor(private router: Router, private toastr: ToastrService, private loginService: SigninService) { }

  ngOnInit() { }

  changePassword(form: NgForm) {
    if (form.valid) {
      this.loginService.forgotPassword(form.value.username).
        subscribe((result: any) => {
          if (!isNullOrUndefined(result.success)) {
            this.toastr.success('Link has been sent', '', { positionClass: 'toast-bottom-center' });
          }
        }, (error: any) => {
          this.error = 'This email address does not exist';
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
