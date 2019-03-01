import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PagerService } from '../../services/pagination.service';

@Component({
    selector: 'app-paging',
    templateUrl: './paging.component.html',
    styleUrls: ['./paging.component.css'],
})
export class PagingComponent implements OnInit {
    model: any[];
    pagedItems: any[];
    @Input() pager: any = [];
    @Input() totalCount: number;
    @Input() currentPage: number;
    @Input() pageSize: number;
    @Output() selectedPage: EventEmitter<number> = new EventEmitter<number>();

    constructor(private pagerService: PagerService) {
    }

    ngOnInit() { }

    pageSelect(pageNumber?: number) {
        this.currentPage = pageNumber;
        this.selectedPage.emit(this.currentPage);
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.totalCount, this.currentPage, this.pageSize);
        this.pagedItems = this.model.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}
