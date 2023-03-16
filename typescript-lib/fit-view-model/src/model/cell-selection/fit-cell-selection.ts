import { Subscription } from 'rxjs';

import { createCellCoord, CellCoord } from 'fit-core/model/index.js';
import {
  CellSelection,
  CellSelectionFactory,
  TableViewer,
  getViewModelConfig,
} from 'fit-core/view-model/index.js';

import {
  FitCellSelectionRanges,
  CellSelectionRange,
} from './fit-cell-selection-ranges.js';

export class FitCellSelection implements CellSelection {
  public readonly rowHeader: FitCellSelectionRanges;
  public readonly colHeader: FitCellSelectionRanges;
  public readonly pageHeader: FitCellSelectionRanges;
  public readonly body: FitCellSelectionRanges;

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly tableViewer: TableViewer) {
    this.rowHeader = new FitCellSelectionRanges('RowHeader', tableViewer);
    this.colHeader = new FitCellSelectionRanges('ColHeader', tableViewer);
    this.pageHeader = new FitCellSelectionRanges('PageHeader', tableViewer);
    this.body = new FitCellSelectionRanges('Body', tableViewer);
    this.handleBody();
    this.handleRowHeader();
    this.handleColHeader();
    this.handlePageHeader();
  }

  protected handleBody(): void {
    this.subscriptions.push(
      this.body.onAfterAddCell$().subscribe((): void => {
        this.selectHeadersByBody();
      })
    );
  }

  private selectHeadersByBody(): void {
    if (getViewModelConfig().rowHeaderWidth) {
      this.rowHeader.removeRanges();
      for (const cellRange of this.body.getRanges()) {
        this.rowHeader.addRange(
          createCellCoord(cellRange.getFrom().getRowId(), 0),
          createCellCoord(cellRange.getTo().getRowId(), 0)
        );
      }
    }
    if (getViewModelConfig().colHeaderHeight) {
      this.colHeader.removeRanges();
      for (const cellRange of this.body.getRanges()) {
        this.colHeader.addRange(
          createCellCoord(0, cellRange.getFrom().getColId()),
          createCellCoord(0, cellRange.getTo().getColId())
        );
      }
    }
  }

  protected handleRowHeader(): void {
    this.subscriptions.push(
      this.rowHeader.onAfterAddCell$().subscribe((): void => {
        if (this.tableHasNoRowsOrCols()) return;
        this.selectBodyByRowHeader();
        this.selectColHeaderByBody();
      })
    );
    this.subscriptions.push(
      this.rowHeader.onAfterRemovePreviousRanges$().subscribe((): void => {
        if (this.tableHasNoRowsOrCols()) return;
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
    return this.tableViewer.getNumberOfCols() - 1;
  }

  private selectColHeaderByBody(): void {
    this.colHeader.setDisableAfterAddCell(true);
    const numberOfRows: number = getViewModelConfig().rowHeaderWidth ? 1 : 0;
    const numberOfCols: number = this.tableViewer.getNumberOfCols() - 1;
    this.colHeader
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(0, 0))
      .addCell(createCellCoord(numberOfRows, numberOfCols))
      .end();
    this.colHeader.setDisableAfterAddCell(false);
  }

  protected handleColHeader(): void {
    this.subscriptions.push(
      this.colHeader.onAfterAddCell$().subscribe(() => {
        if (this.tableHasNoRowsOrCols()) return;
        this.selectBodyByColHeader();
        this.selectRowHeaderByBody();
      })
    );
    this.subscriptions.push(
      this.colHeader.onAfterRemovePreviousRanges$().subscribe(() => {
        if (this.tableHasNoRowsOrCols()) return;
        this.body.removePreviousRanges();
      })
    );
  }

  private selectBodyByColHeader(): void {
    const lastRange: CellSelectionRange | undefined =
      this.colHeader.getLastRange();
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
    return this.tableViewer.getNumberOfRows() - 1;
  }

  private selectRowHeaderByBody(): void {
    this.rowHeader.setDisableAfterAddCell(true);
    const numberOfRows: number = this.tableViewer.getNumberOfRows() - 1;
    const numberOfCols: number = getViewModelConfig().colHeaderHeight ? 1 : 0;
    this.rowHeader
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(0, 0))
      .addCell(createCellCoord(numberOfRows, numberOfCols))
      .end();
    this.rowHeader.setDisableAfterAddCell(false);
  }

  protected handlePageHeader(): void {
    this.subscriptions.push(
      this.pageHeader.onAfterAddCell$().subscribe((): void => {
        if (this.tableHasNoRowsOrCols()) return;
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

  private tableHasNoRowsOrCols(): boolean {
    const numberOfRows: number = this.tableViewer.getNumberOfRows();
    const numberOfCols: number = this.tableViewer.getNumberOfCols();
    return numberOfRows <= 0 || numberOfCols <= 0;
  }

  public clear(): this {
    this.body.removeRanges();
    this.rowHeader.removeRanges();
    this.colHeader.removeRanges();
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
