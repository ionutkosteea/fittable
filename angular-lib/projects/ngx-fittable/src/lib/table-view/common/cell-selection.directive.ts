import { Directive, HostListener, Input } from '@angular/core';

import {
  CellSelectionListener,
  CellSelectionRanges,
} from 'fit-core/view-model';

import { getCellCoord } from '../../controls-view/common/control-utils.model';

@Directive({ selector: '[fitCellSelection]' })
export class CellSelectionDirective {
  @Input() cellSelectionListener?: CellSelectionListener;
  @Input() cellSelectionRanges?: CellSelectionRanges;

  @HostListener('mousedown', ['$event', '$event.target']) onMouseDown(
    event: MouseEvent,
    htmlCell: HTMLElement
  ): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onMouseDown(getCellCoord(htmlCell), event);
  }

  @HostListener('mousemove', ['$event', '$event.target']) onMouseMove(
    event: MouseEvent,
    htmlCell: HTMLElement
  ): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onMouseMove(getCellCoord(htmlCell), event);
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

  @HostListener('window:keyup', ['$event']) onGlobalKeyUp(): void {
    this.cellSelectionListener
      ?.setCellSelectionRanges(this.getCellSelectionRanges())
      .onGlobalKeyUp();
  }

  private getCellSelectionRanges(): CellSelectionRanges {
    if (this.cellSelectionRanges) return this.cellSelectionRanges;
    else throw new Error('Cell selection ranges is not defined!');
  }
}
