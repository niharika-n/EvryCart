import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { isNullOrUndefined, debug } from 'util';
import { LoginUser } from '../../shared/login-model';
import { SigninService } from '../../services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private layoutService: LayoutService, private loginService: SigninService, private router: Router) { }
  loginModel: LoginUser;
  CategoryArr = [];
  AllCategoryArr = [];
  isCategoryDropdown = false;

  ngOnInit() {
    if (localStorage.getItem('user') != null) {
      this.loginModel = JSON.parse(localStorage.getItem('user'));
      this.loginModel.imageContent = 'data:image/png;base64,' + this.loginModel.imageContent;
    }
    this.pageStart();
  }

  pageStart() {
    this.layoutService.getCategories().
      subscribe((result: any) => {
        if (result.categoryResult.length !== 0 && !isNullOrUndefined(result.categoryResult)) {
          for (let i = 0; i < result.categoryResult.length; i++) {
            this.AllCategoryArr.push(result.categoryResult[i]);
          }
          for (let i = 0; i < 5; i++) {
            this.CategoryArr.push(this.AllCategoryArr[i]);
          }
        }
      });
  }

  logout() {
    this.loginService.logout();
  }
}
