import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { EmailTemplateModel } from '../admin/email-template/email-template';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    id = 0;
    file = null;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    getEmail(template: string) {
        const queryParameters = new HttpParams().set('templateType', template);
        return this.httpclient.get('api/emailtemplate/gettemplate', { params: queryParameters });
    }

    updateEmail(template: EmailTemplateModel) {
        return this.httpclient.put('api/emailtemplate/updatetemplate', template).
            pipe(map(x => {
                return x;
            }));
    }
}
