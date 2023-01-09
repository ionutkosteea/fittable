import { Subscription } from 'rxjs';

import {
  Table,
  createCellCoord,
  asTableColumnHeader,
  asTableRowHeader,
  CellRangeList,
  CellRange,
  CellCoord,
} from 'fit-core/model/index.js';
import {
  CellSelection,
  CellSelectionFactory,
  TableViewer,
  CellSelectionRanges,
} from 'fit-core/view-model/index.js';

import {
  FitCellSelectionRanges,
  CellSelectionRange,
} from './fit-cell-selection-ranges.js';

export class FitCellSelection implements CellSelection {
  public readonly rowHeader: FitCellSelectionRanges;
  public readonly columnHeader: FitCellSelectionRanges;
  public readonly pageHeader: FitCellSelectionRanges;
  public readonly body: FitCellSelectionRanges;

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly tableViewer: TableViewer) {
    this.rowHeader = new FitCellSelectionRanges(tableViewer);
    this.columnHeader = new FitCellSelectionRanges(tableViewer);
    this.pageHeader = new FitCellSelectionRanges(tableViewer);
    this.body = new FitCellSelectionRanges(tableViewer);
    this.body.setFocus(true);
    this.handleBody();
    this.handleRowHeader();
    this.handleColumnHeader();
    this.handlePageHeader();
  }

  protected handleBody(): void {
    this.subscriptions.push(
      this.body.onAfterAddCell$().subscribe((): void => {
        this.rowHeader.setDisableAfterAddCell(true);
        this.columnHeader.setDisableAfterAddCell(true);
        this.selectHeadersByBody();
        this.rowHeader.setDisableAfterAddCell(false);
        this.columnHeader.setDisableAfterAddCell(false);
      })
    );
  }

  private selectHeadersByBody(): void {
    const table: Table = this.tableViewer.table;
    let numberOfRows: number =
      asTableColumnHeader(table)?.getColumnHeader().getNumberOfRows() ?? 0;
    if (numberOfRows > 0) numberOfRows--;
    let numberOfColumns: number =
      asTableRowHeader(table)?.getRowHeader().getNumberOfColumns() ?? 0;
    if (numberOfColumns > 0) numberOfColumns--;
    this.selectHeaderByBody(this.rowHeader, undefined, numberOfColumns);
    this.selectHeaderByBody(this.columnHeader, numberOfRows, undefined);
  }

  private selectHeaderByBody(
    headerRanges: CellSelectionRanges,
    numberOfRows?: number,
    numberOfColumns?: number
  ): void {
    const cellRangeList: CellRangeList = new CellRangeList();
    for (const cellRange of this.body.getRanges()) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        cellRangeList.addCell(numberOfRows ?? rowId, numberOfColumns ?? colId);
      });
    }

    headerRanges.removeRanges();
    cellRangeList.getRanges().forEach((cellRange: CellRange): void => {
      headerRanges.addRange(cellRange.getFrom(), cellRange.getTo());
    });
  }

  protected handleRowHeader(): void {
    this.subscriptions.push(
      this.rowHeader.onAfterAddCell$().subscribe((): void => {
        if (this.tableHasNoRowsOrColumns()) return;
        this.selectBodyByRowHeader();
        this.selectColumnHeaderByBody();
      })
    );
    this.subscriptions.push(
      this.rowHeader.onAfterRemovePreviousRanges$().subscribe((): void => {
        if (this.tableHasNoRowsOrColumns()) return;
        this.body.removePreviousRanges();
      })
    );
  }

  private selectBodyByRowHeader(): void {
    const lastRange: CellSelectionRange | undefined =
      this.rowHeader.getLastRange();
    if (lastRange === undefined) return;
    const firstRowId: number | undefined = lastRange.getFirstCell()?.getRowId();
    if (firstRowId === undefined) return;
    let lastRowId: number = firstRowId;
    const lastCell: CellCoord | undefined = lastRange.getLastCell();
    if (lastCell) {
      this.body.removeLastRange();
      lastRowId = lastCell.getRowId();
    }
    const from: CellCoord = createCellCoord(firstRowId, 0);
    const to: CellCoord = createCellCoord(lastRowId, this.lastColId);
    this.body.addRange(from, to).end();
  }

  private get lastColId(): number {
    return this.tableViewer.table.getNumberOfColumns() - 1;
  }

  private selectColumnHeaderByBody(): void {
    this.columnHeader.setDisableAfterAddCell(true);
    const table: Table = this.tableViewer.table;
    const numberOfRows: number =
      asTableColumnHeader(table)?.getColumnHeader().getNumberOfRows() ?? 0;
    const numberOfColumns: number = table.getNumberOfColumns() - 1;
    this.columnHeader
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(0, 0))
      .addCell(createCellCoord(numberOfRows, numberOfColumns))
      .end();
    this.columnHeader.setDisableAfterAddCell(false);
  }

  protected handleColumnHeader(): void {
    this.subscriptions.push(
      this.columnHeader.onAfterAddCell$().subscribe(() => {
        if (this.tableHasNoRowsOrColumns()) return;
        this.selectBodyByColumnHeader();
        this.selectRowHeaderByBody();
      })
    );
    this.subscriptions.push(
      this.columnHeader.onAfterRemovePreviousRanges$().subscribe(() => {
        if (this.tableHasNoRowsOrColumns()) return;
        this.body.removePreviousRanges();
      })
    );
  }

  private selectBodyByColumnHeader(): void {
    const lastRange: CellSelectionRange | undefined =
      this.columnHeader.getLastRange();
    if (lastRange === undefined) return;
    const firstColId: number | undefined = lastRange.getFirstCell()?.getColId();
    if (firstColId === undefined) return;
    let lastColId: number = firstColId;
    const lastCell: CellCoord | undefined = lastRange.getLastCell();
    if (lastCell) {
      this.body.removeLastRange();
      lastColId = lastCell.getColId();
    }
    const from: CellCoord = createCellCoord(0, firstColId);
    const to: CellCoord = createCellCoord(this.lastRowId, lastColId);
    this.body.addRange(from, to).end();
  }

  private get lastRowId(): number {
    return this.tableViewer.table.getNumberOfRows() - 1;
  }

  private selectRowHeaderByBody(): void {
    this.rowHeader.setDisableAfterAddCell(true);
    const table: Table = this.tableViewer.table;
    const numberOfRows: number = table.getNumberOfRows() - 1;
    const numberOfColumns: number | undefined =
      asTableRowHeader(table)?.getRowHeader().getNumberOfColumns() ?? 0;
    this.rowHeader
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(0, 0))
      .addCell(createCellCoord(numberOfRows, numberOfColumns))
      .end();
    this.rowHeader.setDisableAfterAddCell(false);
  }

  protected handlePageHeader(): void {
    this.subscriptions.push(
      this.pageHeader.onAfterAddCell$().subscribe((): void => {
        if (this.tableHasNoRowsOrColumns()) return;
        this.selectBody();
      })
    );
  }

  private selectBody(): void {
    this.body
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(0, 0))
      .addCell(createCellCoord(this.lastRowId, this.lastColId))
      .end();
  }

  private tableHasNoRowsOrColumns(): boolean {
    const numberOfRows: number = this.tableViewer.table.getNumberOfRows();
    const numberOfColumns: number = this.tableViewer.table.getNumberOfColumns();
    return numberOfRows <= 0 || numberOfColumns <= 0;
  }

  public clear(): this {
    this.body.removeRanges();
    this.rowHeader.removeRanges();
    this.columnHeader.removeRanges();
    this.pageHeader.removeRanges();
    return this;
  }

  public destroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

export class FitCellSelectionFactory implements CellSelectionFactory {
  public createCellSelection(tableViewer: TableViewer): FitCellSelection {
    return new FitCellSelection(tableViewer);
  }
}
