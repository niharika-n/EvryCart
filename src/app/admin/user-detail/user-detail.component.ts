import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../shared/login-model';
import { SettingsService } from '../../services/settings.service';
import { SpinnerService } from '../../services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { PagerService } from '../../services/pagination.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  model: LoginUser[];
  totalCount = 0;
  id = 0;
  message = '';
  pager: any = [];
  sortColumn = '';
  searchText = '';
  pageSize = 5;
  currentPage = 1;
  sortOrder = false;

  countCheck = 1;
  selectedRole = false;
  userRoles: any[];
  preselectedRole: any[];

  constructor(private settingsService: SettingsService, private spinnerService: SpinnerService,
    private translate: TranslateService, private pagerService: PagerService, private errorService: ErrorService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.listing('', this.currentPage, this.pageSize);
  }

  listing(search: string, selectedPage: number, selectedSize: number) {
    this.message = '';
    this.searchText = search;
    if (isNullOrUndefined(selectedPage)) {
      selectedPage = this.currentPage;
    }
    if (isNullOrUndefined(selectedSize)) {
      selectedSize = this.pageSize;
    }
    this.spinnerService.startRequest();
    this.settingsService.userList(this.searchText, selectedPage, selectedSize, 'UserID', true)
      .subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          if (!isNullOrUndefined(result.body.userResult) && result.body.userResult.length > 0) {
            this.model = result.body.userResult;
            this.totalCount = result.body.totalCount;
            this.setPage(this.currentPage);
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
          this.message = this.translate.instant('common.not-found');
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
        this.message = this.translate.instant('common.not-present', { param: 'users' });
      });
  }

  sizeSelect(size?: number) {
    this.pageSize = +size;
    this.listing(this.searchText, 1, this.pageSize);
  }

  pageSelect(pageNumber?: number) {
    this.currentPage = pageNumber;
    this.listing(this.searchText, this.currentPage, this.pageSize);
  }

  selectDirection(order: any) {
    this.sortOrder = order;
  }

  selectColumn(columnName: any) {
    this.sortColumn = columnName;
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
  }

  onChange(userId: number, value: any, isChecked: boolean, requiredValue?: any) {
    if (this.id !== userId) {
      this.countCheck = 1;
      this.preselectedRole = [];
    }
    this.id = userId;
    this.userRoles = this.model.find(x => x.userID === userId).roleID;
    if (this.countCheck < 2) {
      for (let i = 0; i < this.userRoles.length; i++) {
        this.preselectedRole.push(this.userRoles[i]);
      }
      this.countCheck++;
    }
    const selectedValue = +value;
    if (requiredValue !== null) {
      requiredValue = +requiredValue;
    }
    if (isChecked) {
      this.selectedRole = true;
      if (selectedValue !== null) {
        this.userRoles.push(selectedValue);
        if (requiredValue !== null) {
          this.userRoles.push(requiredValue);
        }
      }
    } else {
      const index = this.userRoles.indexOf(selectedValue);
      this.userRoles.splice(index, 1);
      if (requiredValue !== null) {
        const optionalIndex = this.userRoles.indexOf(requiredValue);
      }
    }
    if (this.userRoles.length === 0) {
      this.selectedRole = false;
    }
  }

  save(id: number) {
    let check = false;
    let difference = null;
    if (!isNullOrUndefined(this.preselectedRole) && this.preselectedRole.length > 0) {
      difference = this.preselectedRole.filter(x =>
        !this.userRoles.includes(x)).concat(this.userRoles.filter(x =>
          !this.preselectedRole.includes(x)));
      if (this.preselectedRole.length < this.userRoles.length) {
        check = true;
        this.add(id, check, difference);
      } else if (this.preselectedRole.length > this.userRoles.length) {
        check = false;
        this.add(id, check, difference);
      }
    } else {
      this.toastr.info(this.translate.instant('user-detail.no-role-message', ''));
    }
  }

  add(id: number, check: boolean, rolesArr: any) {
    this.spinnerService.startRequest();
    this.settingsService.changeUserRoles(id, check, rolesArr).
      subscribe((result: any) => {
        if (result.status === 1) {
          this.toastr.success(this.translate.instant('common.update', { param: 'User roles' }), '');
          this.listing('', this.currentPage, this.pageSize);
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
      });
  }


}
