import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';

@Directive({
  selector: '[appSpinner]'
})
export class SpinnerDirective implements OnInit, OnDestroy {
  subscription: Subscription;
  private spinnerObj;

  constructor(private elementRef: ElementRef, private spinnerService: SpinnerService) {
    this.spinnerObj = elementRef.nativeElement;
  }

  ngOnInit() {
    this.subscription = this.spinnerService.requestInProgress$
      .subscribe(item => {
        if (item <= 0) {
          this.spinnerObj.style.display = 'none';
        } else {
          this.spinnerObj.style.display = 'block';
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
