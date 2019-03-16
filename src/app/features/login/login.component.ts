import { Component, OnInit } from '@angular/core';
import { SigninService } from '../../services/login.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  submitted = false;
  errorCheck = false;
  error = '';
  returnUrl: string;

  constructor(
    private route: ActivatedRoute, private router: Router, private signInService: SigninService,
    private toastr: ToastrService, private translate: TranslateService
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!isNullOrUndefined(token)) {
      localStorage.removeItem('token');
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'admin/dashboard';
  }

  login(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.signInService.login(this.model.username, this.model.password)
        .subscribe(result => {
          if (result.status === 1) {
            localStorage.setItem('token', JSON.stringify((result.body.value.token)));
            localStorage.setItem('user', JSON.stringify(result.body.value.user));
            localStorage.setItem('userRole', result.body.value.user.roleID);
            if (result.body.value.user.roleID.includes(2 || 1)) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(['']);
            }
          } else {
            this.errorCheck = true;
            this.toastr.error(this.translate.instant('login.err-details'), '');
          }
        }, error => {
          console.log('error: ' + error);
        });
    }
  }
}
