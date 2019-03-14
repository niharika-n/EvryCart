import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/content-template.service';
import { EmailTemplateModel } from './email-template';
import { SpinnerService } from '../../services/spinner.service';
import { TemplateType } from './template.enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

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
    private translate: TranslateService, private toastr: ToastrService) {
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
        this.heading = TemplateType[newVal];
        this.model = result.body;
        this.emailContent = result.body.content;
      }, (error: any) => {
        const message = this.translate.instant('templates.empty-template');
        console.log(message);
      });
  }

  update(templateValue: string) {
    this.model.content = templateValue;
    this.contentService.updateEmail(this.model).subscribe(
      (result: any) => {
        if (result.status === true) {
          this.toastr.success(this.translate.instant('common.update', { param: 'Template' }), '');
        }
      });
  }

}
