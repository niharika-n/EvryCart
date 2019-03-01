import { Component, OnInit } from '@angular/core';
import { SigninService } from '../../services/login.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
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
    private route: ActivatedRoute,
    private router: Router,
    private signInService: SigninService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!isNullOrUndefined(token)) {
      localStorage.removeItem('token');
    }

    this.signInService.logout();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'admin/dashboard';
  }

  login(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.signInService.login(this.model.username, this.model.password)
        .subscribe(result => {
          if (result.statusCode === 200) {
            localStorage.setItem('token', JSON.stringify((result.value.token)));
            localStorage.setItem('user', JSON.stringify(result.value.user));
            localStorage.setItem('userRole', result.value.user.roleID);
            if (result.value.user.roleID === 1) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(['']);
            }
          } else {
            this.errorCheck = true;
            this.toastr.error('Username or Password is incorrect', '', { positionClass: 'toast-bottom-center' });
          }
        }, error => {
          console.log('error: ' + error);
        });
    }
  }
}
