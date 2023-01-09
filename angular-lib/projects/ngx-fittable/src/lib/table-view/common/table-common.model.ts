import { RangeIterator } from 'fit-core/common';
import { CssStyle, Value } from 'fit-core/model';
import {
  ViewModel,
  HostListeners,
  CellSelectionListener,
} from 'fit-core/view-model';

export abstract class TableCommon {
  protected abstract viewModel: ViewModel;
  protected abstract hostListeners: HostListeners;

  public readonly hasColumnHeader = (): boolean =>
    this.viewModel.tableViewer.hasColumnHeader();

  public readonly getColumnHeaderRowIds = (): RangeIterator =>
    this.viewModel.tableViewer.getColumnHeaderRowIds();

  public readonly getColumnHeaderRowHeight = (rowId: number) =>
    this.viewModel.tableViewer.getColumnHeaderRowHeight(rowId);

  public readonly getColumnLabel = (
    colId: number
  ): string | number | undefined =>
    this.viewModel.tableViewer.getColumnHeaderCellValue(0, colId);

  public readonly getRowLabel = (rowId: number): string | number | undefined =>
    this.viewModel.tableViewer.getRowHeaderCellValue(rowId, 0);

  public readonly hasRowHeader = (): boolean =>
    this.viewModel.tableViewer.hasRowHeader();

  public readonly getRowHeaderColumnIds = (): RangeIterator =>
    this.viewModel.tableViewer.getRowHeaderColIds();

  public readonly getRowHeaderColumnWidth = (colId: number) =>
    this.viewModel.tableViewer.getRowHeaderColumnWidth(colId);

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
    this.viewModel.tableScroller.getTableRowIds();

  public readonly getColumnIds = (): RangeIterator =>
    this.viewModel.tableScroller.getTableColIds();

  public readonly getColumnWidth = (colId: number): number =>
    this.viewModel.tableViewer.getColumnWidth(colId);

  public readonly getRowHeight = (rowId: number): number =>
    this.viewModel.tableViewer.getRowHeight(rowId);

  public getCellSelectionListener = (): CellSelectionListener | undefined =>
    this.hostListeners.cellSelectionListener;

  public readonly showContextMenu = (event: MouseEvent): void =>
    this.viewModel.contextMenu &&
    this.hostListeners.windowListener
      ?.setWindow(this.viewModel.contextMenu)
      .onShow(event);

  protected readonly getScrollLeft = (): number =>
    this.viewModel.tableScroller.getLeft();

  protected readonly getScrollTop = (): number =>
    this.viewModel.tableScroller.getTop();

  protected readonly getOffsetX = (): number =>
    this.viewModel?.tableScroller.getHorizontalScrollbar()?.getOffset() ?? 0;

  protected readonly getOffsetY = (): number =>
    this.viewModel.tableScroller.getVerticalScrollbar()?.getOffset() ?? 0;

  protected readonly getRowHeaderWidth = (): number =>
    this.viewModel.tableViewer.getRowHeaderWidth();

  protected readonly getColumnHeaderHeight = (): number =>
    this.viewModel.tableViewer.getColumnHeaderHeight();
}
