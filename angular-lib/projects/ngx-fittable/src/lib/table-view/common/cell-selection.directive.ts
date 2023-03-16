import { Directive, HostListener, Input } from '@angular/core';

import {
  CellSelectionListener,
  CellSelectionRanges,
} from 'fit-core/view-model';

@Directive({ selector: '[fitCellSelection]' })
export class CellSelectionDirective {
  @Input() cellSelectionListener?: CellSelectionListener;
  @Input() cellSelectionRanges?: CellSelectionRanges;

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onMouseDown(event);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onMouseMove(event);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onMouseLeave();
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onMouseEnter();
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onGlobalMouseDown();
  }

  @HostListener('window:mouseup', ['$event']) onGlobalMouseUp(
    event: MouseEvent
  ): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onGlobalMouseUp(event);
  }

  @HostListener('window:keydown', ['$event']) onGlobalKeyDown(
    event: KeyboardEvent
  ): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onGlobalKeyDown(event);
  }

  private getCellSelectionRanges(): CellSelectionRanges {
    if (this.cellSelectionRanges) return this.cellSelectionRanges;
    else throw new Error('Cell selection ranges is not defined!');
  }
}
