import {
  Directive,
  OnInit,
  ElementRef,
  HostListener,
  input,
} from '@angular/core';

import {
  ScrollContainerListener,
  ScrollContainer,
  createScrollContainerListener,
} from 'fittable-core/view-model';

@Directive({ selector: '[fitScrollContainer]', standalone: true })
export class ScrollContainerDirective implements OnInit {
  scrollContainer = input.required<ScrollContainer>();

  private scrollContainerListener!: ScrollContainerListener;

  constructor(private readonly divRef: ElementRef) { }

  ngOnInit(): void {
    this.scrollContainerListener = createScrollContainerListener(
      this.divRef.nativeElement,
      this.scrollContainer()
    );
  }

  @HostListener('scroll', ['$event'])
  public onScroll(event: Event): void {
    this.scrollContainerListener.onScroll(event);
  }
}
