import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/content-template.service';
import { EmailTemplateModel } from './email-template';
import { SpinnerService } from '../../services/spinner.service';
import { TemplateType } from './template.enum';

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

  constructor(private contentService: TemplateService, private spinnerService: SpinnerService) {
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
        this.model = result;
        this.emailContent = result.content;
      }, (error: any) => {
        const message = 'Selected template does not exist.';
        console.log(message);
      });
  }

  update(templateValue: string) {
    this.model.content = templateValue;
    this.contentService.updateEmail(this.model).subscribe(
      (result: any) => {
        console.log(result);
      });
  }

}
