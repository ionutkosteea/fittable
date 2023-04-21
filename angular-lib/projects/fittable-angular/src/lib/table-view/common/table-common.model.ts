import { RangeIterator } from 'fittable-core/common';
import { CssStyle, Value } from 'fittable-core/model';
import {
  ViewModel,
  getViewModelConfig,
  createWindowListener,
} from 'fittable-core/view-model';

export abstract class TableCommon {
  protected abstract viewModel: ViewModel;

  public readonly hasColHeader = (): boolean =>
    this.viewModel.tableViewer.hasColHeader();

  public readonly getColLabel = (
    colId: number
  ): string | number | undefined => {
    const labelFn: ((colId: number) => string | number) | undefined =
      getViewModelConfig().colHeaderTextFn;
    return labelFn && labelFn(colId);
  };

  public readonly getRowLabel = (
    rowId: number
  ): string | number | undefined => {
    const labelFn: ((rowId: number) => string | number) | undefined =
      getViewModelConfig().rowHeaderTextFn;
    return labelFn && labelFn(rowId);
  };

  public readonly hasRowHeader = (): boolean =>
    this.viewModel.tableViewer.hasRowHeader();

  public readonly getCellStyle = (
    rowId: number,
    colId: number
  ): CssStyle | null =>
    this.viewModel.tableViewer.getCellStyle(rowId, colId)?.toCss() ?? null;

  public readonly getCellValue = (
    rowId: number,
    colId: number
  ): Value | undefined => this.viewModel.tableViewer.getCellValue(rowId, colId);

  public readonly isHiddenCell = (rowId: number, colId: number): boolean =>
    this.viewModel.tableViewer.isHiddenCell(rowId, colId);

  public readonly getRowSpan = (rowId: number, colId: number): number =>
    this.viewModel.tableViewer.getRowSpan(rowId, colId);

  public readonly getColSpan = (rowId: number, colId: number) =>
    this.viewModel.tableViewer.getColSpan(rowId, colId);

  public readonly getRowIds = (): RangeIterator =>
    this.viewModel.tableScroller.getRenderableRows();

  public readonly getColIds = (): RangeIterator =>
    this.viewModel.tableScroller.getRenderableCols();

  public readonly getColWidth = (colId: number): number =>
    this.viewModel.tableViewer.getColWidth(colId);

  public readonly getRowHeight = (rowId: number): number =>
    this.viewModel.tableViewer.getRowHeight(rowId);

  public readonly showContextMenu = (event: MouseEvent): void =>
    this.viewModel.contextMenu &&
    createWindowListener(this.viewModel.contextMenu).onShow(event);

  protected readonly getScrollLeft = (): number =>
    this.viewModel.tableScroller.getLeft();

  protected readonly getScrollTop = (): number =>
    this.viewModel.tableScroller.getTop();

  protected readonly getOffsetX = (): number =>
    this.viewModel.tableScroller.getOffsetX();

  protected readonly getOffsetY = (): number =>
    this.viewModel.tableScroller.getOffsetY();

  protected readonly getRowHeaderWidth = (): number =>
    this.viewModel.tableViewer.getRowHeaderWidth();

  protected readonly getColHeaderHeight = (): number =>
    this.viewModel.tableViewer.getColHeaderHeight();
}
