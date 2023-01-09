import {
  Directive,
  OnInit,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

import { TableScrollerListener } from 'fit-core/view-model';

@Directive({ selector: '[fitTableScroller]' })
export class TableScrollerDirective implements OnInit {
  @Input() tableScrollerListener!: TableScrollerListener;

  constructor(private readonly containerRef: ElementRef) {}

  public ngOnInit(): void {
    setTimeout((): void => {
      this.tableScrollerListener.onInit(this.containerRef.nativeElement);
    });
  }

  @HostListener('scroll', ['$event'])
  public onScroll(event: Event): void {
    this.tableScrollerListener.onScroll(event);
  }
}
