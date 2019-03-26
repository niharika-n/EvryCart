import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/content-template.service';
import { EmailTemplateModel } from './email-template';
import { SpinnerService } from '../../services/spinner.service';
import { TemplateType } from './template.enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css']
})
export class EmailTemplateComponent implements OnInit {
  model: EmailTemplateModel;
  id = 0;
  emailContent = '';
  templateType = TemplateType;
  heading = '';
  keys: any;
  selectCheck = false;

  constructor(private contentService: TemplateService, private spinnerService: SpinnerService,
    private translate: TranslateService, private toastr: ToastrService, private errorService: ErrorService) {
    this.keys = Object.keys(this.templateType);
    this.model = {
      id: 0,
      content: '',
      templateName: ''
    };
  }

  ngOnInit() {
  }

  onSelect(event: any) {
    this.selectCheck = true;
    const newVal = event.target.value;
    this.spinnerService.startRequest();
    this.contentService.getEmail(newVal).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          this.heading = TemplateType[newVal];
          if (!isNullOrUndefined(result.body)) {
            this.model = result.body;
            this.emailContent = result.body.content;
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
        const message = this.translate.instant('templates.empty-template');
      });
  }

  update(templateValue: string) {
    this.model.content = templateValue;
    this.contentService.updateEmail(this.model).subscribe(
      (result: any) => {
        if (result.status === 1) {
          this.toastr.success(this.translate.instant('common.update', { param: 'Template' }), '');
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
        const message = this.translate.instant('templates.empty-template');
      });
  }

}
