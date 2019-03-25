import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorCodes, ResponseStatus } from '../app.enum';

@Injectable()
export class ErrorService {

    constructor(private translate: TranslateService, private router: Router, private toastr: ToastrService) {
    }

    handleError(error) {
        if (error === ErrorCodes.UNAUTHORIZED) {
            this.toastr.error(this.translate.instant('error.requestError401'), '');
        } else if (error === ErrorCodes.SERVICE_NOT_FOUND) {
            this.toastr.error(this.translate.instant('error.requestError404'), '');
        } else if (error === ErrorCodes.BAD_REQUEST) {
            this.toastr.error(this.translate.instant('error.requestError400'), '');
        } else {
            this.toastr.error(this.translate.instant('error.requestError500'), '');
        }
    }

    handleFailure(statusCode) {
        if (statusCode === ResponseStatus.BAD_REQUEST) {
            this.toastr.error(this.translate.instant('error.requestError400'), '');
        } else {
            this.toastr.error(this.translate.instant('error.requestError500'), '');
        }
    }
}



