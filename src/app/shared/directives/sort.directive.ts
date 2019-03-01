import { Directive, Input, ElementRef, OnInit, Renderer, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appSort]',
})

export class SortDirective implements OnInit {
    @Input() data: any[];
    @Input() sortKey: any;
    @Output() Direction = new EventEmitter<any>();
    @Output() ColumnName = new EventEmitter<any>();
    private toggleSort: boolean;

    constructor(private el: ElementRef, private renderer: Renderer) {
        this.toggleSort = false;
    }

    ngOnInit() {
        this.renderer.listen(this.el.nativeElement, 'click', (event) => {
            const parentNode = this.el.nativeElement.parentNode;
            const children = parentNode.children;

            if (this.data && this.sortKey) {
                const sortedData: any = this.sortArray();
            }
            this.toggleSort = !this.toggleSort;
        });
    }

    sortArray(): Array<any> {
        const tempArray: Array<any> = this.data;
        tempArray.sort((a: any, b: any) => {
            const aKey = a[this.sortKey];
            const str1: string = a[this.sortKey].toLowerCase();
            const str2: string = b[this.sortKey].toLowerCase();
            if (this.toggleSort) {
                if (str1 < str2) {
                    return -1;
                }
                if (str1 > str2) {
                    return 1;
                }
            } else {
                if (str1 > str2) {
                    return -1;
                }
                if (str1 < str2) {
                    return 1;
                }
            }
            return 0;
        });
        this.Direction.emit(this.toggleSort);
        this.ColumnName.emit(this.sortKey);
        return tempArray;
    }
}
