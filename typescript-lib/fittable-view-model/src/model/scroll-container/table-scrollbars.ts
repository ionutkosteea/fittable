import { TableViewer } from 'fittable-core/view-model';

import { VirtualScrollbar } from './fit-scrollbar.js';

export class VerticalScrollbar extends VirtualScrollbar {
  constructor(private readonly tableViewer: TableViewer) {
    super();
  }
  protected getNumberOfLines(): number {
    return this.tableViewer.getNumberOfRows();
  }
  protected getDimension(): number {
    return this.tableViewer.getBodyHeight();
  }
  protected getLinePosition(rowId: number): number {
    return this.tableViewer.getRowPosition(rowId);
  }
  protected getLineDimension(rowId: number): number {
    return this.tableViewer.getRowHeight(rowId);
  }
  protected isHiddenLine(colId: number): boolean {
    return this.tableViewer.hasHiddenCells4Row(colId);
  }
}

export class HorizontalScrollbar extends VirtualScrollbar {
  constructor(private readonly tableViewer: TableViewer) {
    super();
  }
  protected getNumberOfLines(): number {
    return this.tableViewer.getNumberOfCols();
  }
  protected getDimension(): number {
    return this.tableViewer.getBodyWidth();
  }
  protected getLinePosition(colId: number): number {
    return this.tableViewer.getColPosition(colId);
  }
  protected getLineDimension(colId: number): number {
    return this.tableViewer.getColWidth(colId);
  }
  protected isHiddenLine(colId: number): boolean {
    return this.tableViewer.hasHiddenCells4Col(colId);
  }
}
