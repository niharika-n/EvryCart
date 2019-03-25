import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../shared/login-model';
import { SettingsService } from '../../services/settings.service';
import { SpinnerService } from '../../services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';
import { PagerService } from '../../services/pagination.service';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  constructor(private settingsService: SettingsService, private spinnerService: SpinnerService,
    private translate: TranslateService, private pagerService: PagerService,
    private httpclient: HttpClient, private toastr: ToastrService) { }

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
          this.message = this.translate.instant('common.not-found');
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
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
}
