import { Component, OnInit } from '@angular/core';
import { SigninService } from '../../services/login.service';
import { Router } from '@angular/router';
import { LoginUser } from '../../shared/login-model';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  loginModel: LoginUser;
  userImg: string;
  constructor(private logoutService: SigninService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginModel = JSON.parse(localStorage.getItem('user'));
    this.userImg = 'data:image/png;base64,' + this.loginModel.imageContent;
  }

  logout() {
    this.logoutService.logout();
  }
}
