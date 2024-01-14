import { RangeIterator } from 'fittable-core/common';
import { CssStyle, Value } from 'fittable-core/model';
import {
  ViewModel,
  getViewModelConfig,
  createWindowListener,
} from 'fittable-core/view-model';

export abstract class TableCommon {
  protected abstract viewModel: ViewModel;

  hasColHeader(): boolean {
    return this.viewModel.tableViewer.hasColHeader();
  }

  getColLabel(colId: number): string | number | undefined {
    const labelFn: ((colId: number) => string | number) | undefined =
      getViewModelConfig().colHeaderTextFn;
    return labelFn && labelFn(colId);
  }

  getRowLabel(rowId: number): string | number | undefined {
    const labelFn: ((rowId: number) => string | number) | undefined =
      getViewModelConfig().rowHeaderTextFn;
    return labelFn && labelFn(rowId);
  }

  hasRowHeader(): boolean {
    return this.viewModel.tableViewer.hasRowHeader();
  }

  getCellStyle = (rowId: number, colId: number): CssStyle | null => {
    return (
      this.viewModel.tableViewer.getCellStyle(rowId, colId)?.toCss() ?? null
    );
  };

  getCellValue(rowId: number, colId: number): Value | undefined {
    return this.viewModel.tableViewer.getCellValue(rowId, colId);
  }

  getFormatedCellValue(rowId: number, colId: number): Value | undefined {
    return this.viewModel.tableViewer.getFormatedCellValue(rowId, colId);
  }

  isHiddenCell(rowId: number, colId: number): boolean {
    return this.viewModel.tableViewer.isHiddenCell(rowId, colId);
  }

  getRowSpan(rowId: number, colId: number): number {
    return this.viewModel.tableViewer.getRowSpan(rowId, colId);
  }

  getColSpan(rowId: number, colId: number) {
    return this.viewModel.tableViewer.getColSpan(rowId, colId);
  }

  getRowIds(): RangeIterator {
    return this.viewModel.tableScrollContainer.getRenderableRows();
  }

  getColIds(): RangeIterator {
    return this.viewModel.tableScrollContainer.getRenderableCols();
  }

  getColWidth(colId: number): number {
    return this.viewModel.tableViewer.getColWidth(colId);
  }

  getRowHeight(rowId: number): number {
    return this.viewModel.tableViewer.getRowHeight(rowId);
  }

  showContextMenu(event: MouseEvent): void {
    return (
      this.viewModel.contextMenu &&
      createWindowListener(this.viewModel.contextMenu).onShow(event)
    );
  }

  getScrollLeft(): number {
    return this.viewModel.tableScrollContainer.getScroller().getLeft();
  }

  getScrollTop(): number {
    return this.viewModel.tableScrollContainer.getScroller().getTop();
  }

  getOffsetX(): number {
    return this.viewModel.tableScrollContainer.getInnerOffsetX();
  }

  getOffsetY(): number {
    return this.viewModel.tableScrollContainer.getInnerOffsetY();
  }

  getRowHeaderWidth(): number {
    return this.viewModel.tableViewer.getRowHeaderWidth();
  }

  getColHeaderHeight(): number {
    return this.viewModel.tableViewer.getColHeaderHeight();
  }

  getBodyHeight(): number {
    return this.viewModel.tableViewer.getBodyHeight();
  }

  getBodyWidth(): number {
    return this.viewModel.tableViewer.getBodyWidth();
  }

  getBodyOffset(): CssStyle {
    return this.viewModel.mobileLayout.bodyOffset;
  }

  getRowHeaderOffset(): CssStyle {
    return this.viewModel.mobileLayout.rowHeaderOffset;
  }

  getColHeaderOffset(): CssStyle {
    return this.viewModel.mobileLayout.colHeaderOffset;
  }
}
