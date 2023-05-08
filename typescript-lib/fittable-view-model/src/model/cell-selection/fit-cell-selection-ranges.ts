import { Subject, Observable } from 'rxjs';

import {
  CellCoord,
  CellRange,
  createCellCoord,
  createCellRange,
} from 'fittable-core/model';
import {
  CellSelectionRanges,
  NeighborCells,
  TableViewer,
} from 'fittable-core/view-model';

import { FitNeighborCells } from '../common/fit-neighbor-cells.js';

type Name = 'RowHeader' | 'ColHeader' | 'PageHeader' | 'Body';

export class FitCellSelectionRanges implements CellSelectionRanges {
  private ranges: CellSelectionRange[] = [];
  private readonly afterAddCell$: Subject<CellCoord> = new Subject();
  private disableAfterAddCell = false;
  private readonly afterRemovePreviousRanges$: Subject<void> = new Subject();
  private readonly end$: Subject<CellRange[]> = new Subject();
  private focus = false;
  private readonly afterSetFocus$: Subject<boolean> = new Subject();

  constructor(
    public readonly name: Name,
    private readonly tableViewer: TableViewer
  ) {}

  public createRange(): this {
    const newSelection = new CellSelectionRange(this.tableViewer);
    this.ranges.push(newSelection);
    return this;
  }

  public addRange(firstCell: CellCoord, lastCell?: CellCoord): this {
    const range: CellSelectionRange | undefined =
      this.createRange().getLastRange();
    range?.addCell(firstCell);
    lastCell && range?.addCell(lastCell);
    return this;
  }

  public getRanges(): CellRange[] {
    const ranges: CellRange[] = [];
    this.ranges.forEach((selection: CellSelectionRange) => {
      const range: CellRange | undefined = selection.getRange();
      range && ranges.push(range);
    });
    return ranges;
  }

  private hasRange(): boolean {
    return this.ranges.length > 0;
  }

  public getLastRange(): CellSelectionRange | undefined {
    return this.hasRange() ? this.ranges[this.ranges.length - 1] : undefined;
  }

  public removeRanges(): this {
    this.ranges = [];
    return this;
  }

  public removePreviousRanges(): this {
    const lastSelection: CellSelectionRange | undefined = this.getLastRange();
    if (lastSelection) {
      this.ranges = [lastSelection];
      this.afterRemovePreviousRanges$.next();
    }
    return this;
  }

  public onAfterRemovePreviousRanges$(): Observable<void> {
    return this.afterRemovePreviousRanges$.asObservable();
  }

  public removeLastRange(): this {
    this.hasRange() && this.ranges.splice(this.ranges.length - 1);
    return this;
  }

  public getFirstCell(): CellCoord | undefined {
    const lastRange: CellSelectionRange | undefined = this.getLastRange();
    return lastRange ? lastRange.getFirstCell() : undefined;
  }

  public getLastCell(): CellCoord | undefined {
    const lastRange: CellSelectionRange | undefined = this.getLastRange();
    return lastRange ? lastRange.getLastCell() : undefined;
  }

  public addCell(cellCoord: CellCoord): this {
    const lastRange: CellSelectionRange | undefined = this.getLastRange();
    if (!lastRange) {
      throw new Error(
        'No selection range available. Run createRange() methode first.'
      );
    }
    lastRange.addCell(cellCoord);
    !this.disableAfterAddCell && this.afterAddCell$.next(cellCoord);
    return this;
  }

  public onAfterAddCell$(): Observable<CellCoord> {
    return this.afterAddCell$.asObservable();
  }

  public setDisableAfterAddCell(disable: boolean): this {
    this.disableAfterAddCell = disable;
    return this;
  }

  public hasCell(cellCoord: CellCoord): boolean {
    for (const cellSelection of this.ranges) {
      if (cellSelection.hasCell(cellCoord)) return true;
    }
    return false;
  }

  public forEachCell(callbackFn: (rowId: number, colId: number) => void): void {
    for (const cellSelection of this.ranges) {
      cellSelection.forEachCell(callbackFn);
    }
  }

  public getNeighborCells(): NeighborCells {
    const cellCoord: CellCoord | undefined = this.getFirstCell();
    return cellCoord
      ? new FitNeighborCells() //
          .setTableViewer(this.tableViewer)
          .setCell(cellCoord)
      : new FitNeighborCells() //
          .setTableViewer(this.tableViewer);
  }

  public end(): this {
    this.end$.next(this.getRanges());
    return this;
  }

  public onEnd$(): Observable<CellRange[]> {
    return this.end$.asObservable();
  }

  public hasFocus(): boolean {
    return this.focus;
  }

  public setFocus(focus: boolean, ignoreTrigger?: boolean): this {
    this.focus = focus;
    !ignoreTrigger && this.afterSetFocus$.next(focus);
    return this;
  }

  public onAfterSetFocus$(): Observable<boolean> {
    return this.afterSetFocus$.asObservable();
  }
}

export class CellSelectionRange {
  private firstCell?: CellCoord;
  private lastCell?: CellCoord;
  private range?: CellRange;

  constructor(private readonly tableViewer: TableViewer) {}

  public getFirstCell(): CellCoord | undefined {
    return this.firstCell;
  }

  public getLastCell(): CellCoord | undefined {
    return this.lastCell;
  }

  public addCell(cellCoord: CellCoord): this {
    if (this.firstCell) this.lastCell = cellCoord;
    else this.firstCell = cellCoord;
    this.range = createCellRange(this.firstCell, this.lastCell);
    this.includeMergedCells();
    return this;
  }

  private includeMergedCells(): void {
    if (!this.range) throw new Error('Range is not defined!');
    const leftTopCoord: CellCoord = this.range.getFrom();
    const rightTopCoord: CellCoord = this.getRightTopCoord(this.range);
    const rightBottomCoord: CellCoord = this.range.getTo();
    const leftBottomCoord: CellCoord = this.getLeftBottomCoord(this.range);
    const maxToRowId: number = Math.max(
      this.rowIdPlusRowSpan(leftTopCoord),
      this.rowIdPlusRowSpan(rightTopCoord),
      this.rowIdPlusRowSpan(rightBottomCoord),
      this.rowIdPlusRowSpan(leftBottomCoord)
    );
    const maxToColId: number = Math.max(
      this.colIdPlusColSpan(leftTopCoord),
      this.colIdPlusColSpan(rightTopCoord),
      this.colIdPlusColSpan(rightBottomCoord),
      this.colIdPlusColSpan(leftBottomCoord)
    );
    if (maxToRowId > 1 || maxToColId > 1) {
      this.range.setTo(createCellCoord(maxToRowId, maxToColId));
    }
  }

  private rowIdPlusRowSpan(cellCoord: CellCoord): number {
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    const rowSpan: number = this.tableViewer.getRowSpan(rowId, colId);
    return rowId + rowSpan - 1;
  }

  private colIdPlusColSpan(cellCoord: CellCoord): number {
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    const colSpan: number = this.tableViewer.getColSpan(rowId, colId);
    return colId + colSpan - 1;
  }

  private getRightTopCoord(cellRange: CellRange): CellCoord {
    return createCellCoord(
      cellRange.getFrom().getRowId(),
      cellRange.getTo().getColId()
    );
  }

  private getLeftBottomCoord(cellRange: CellRange): CellCoord {
    return createCellCoord(
      cellRange.getTo().getRowId(),
      cellRange.getFrom().getColId()
    );
  }

  public getRange(): CellRange | undefined {
    return this.range;
  }

  public forEachCell(
    cellCoordFn: (rowId: number, colId: number) => void
  ): void {
    this.range?.forEachCell(cellCoordFn);
  }

  public hasCell(cellCoord: CellCoord): boolean {
    return this.range?.hasCell(cellCoord.getRowId(), cellCoord.getColId())
      ? true
      : false;
  }
}
