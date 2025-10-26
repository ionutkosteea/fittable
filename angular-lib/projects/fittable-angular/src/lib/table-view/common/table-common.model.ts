import { InputSignal } from '@angular/core';
import { RangeIterator } from 'fittable-core/common';
import { CssStyle, Value } from 'fittable-core/model';
import {
  ViewModel,
  getViewModelConfig,
  createWindowListener,
} from 'fittable-core/view-model';

export abstract class TableCommon {
  protected abstract viewModel: InputSignal<ViewModel>;

  get rowIds(): RangeIterator {
    return this.viewModel().tableScrollContainer.getRenderableRows();
  }

  get colIds(): RangeIterator {
    return this.viewModel().tableScrollContainer.getRenderableCols();
  }

  get hasRowHeader(): boolean {
    return this.viewModel().tableViewer.hasRowHeader();
  }

  get hasColHeader(): boolean {
    return this.viewModel().tableViewer.hasColHeader();
  }

  get rowHeaderTextFn(): ((rowId: number) => string | number) | undefined {
    return getViewModelConfig().rowHeaderTextFn;
  }

  get colHeaderTextFn(): ((colId: number) => string | number) | undefined {
    return getViewModelConfig().colHeaderTextFn;
  }

  get scrollLeft(): number {
    return this.viewModel().tableScrollContainer.getScroller().getLeft();
  }

  get scrollTop(): number {
    return this.viewModel().tableScrollContainer.getScroller().getTop();
  }

  get offsetX(): number {
    return this.viewModel().tableScrollContainer.getInnerOffsetX();
  }

  get offsetY(): number {
    return this.viewModel().tableScrollContainer.getInnerOffsetY();
  }

  get rowHeaderWidth(): number {
    return this.viewModel().tableViewer.getRowHeaderWidth();
  }

  get colHeaderHeight(): number {
    return this.viewModel().tableViewer.getColHeaderHeight();
  }

  get bodyHeight(): number {
    return this.viewModel().tableViewer.getBodyHeight();
  }

  get bodyWidth(): number {
    return this.viewModel().tableViewer.getBodyWidth();
  }

  get bodyOffset(): CssStyle {
    return this.viewModel().mobileLayout.bodyOffset;
  }

  get rowHeaderOffset(): CssStyle {
    return this.viewModel().mobileLayout.rowHeaderOffset;
  }

  get colHeaderOffset(): CssStyle {
    return this.viewModel().mobileLayout.colHeaderOffset;
  }

  getCellStyle = (rowId: number, colId: number): CssStyle | null => {
    return this.viewModel().tableViewer.getCellStyle(rowId, colId)?.toCss() ?? null;
  }

  getCellValue(rowId: number, colId: number): Value {
    return this.viewModel().tableViewer.getCellFormattedValue(rowId, colId)
  }

  isHiddenCell(rowId: number, colId: number): boolean {
    return this.viewModel().tableViewer.isHiddenCell(rowId, colId);
  }

  getRowSpan(rowId: number, colId: number): number {
    return this.viewModel().tableViewer.getRowSpan(rowId, colId);
  }

  getColSpan(rowId: number, colId: number) {
    return this.viewModel().tableViewer.getColSpan(rowId, colId);
  }

  getColWidth(colId: number): number {
    return this.viewModel().tableViewer.getColWidth(colId);
  }

  getRowHeight(rowId: number): number {
    return this.viewModel().tableViewer.getRowHeight(rowId);
  }

  showContextMenu(event: MouseEvent): void {
    const contextMenu = this.viewModel().contextMenu;
    contextMenu && createWindowListener(contextMenu).onShow(event);
  }
}
