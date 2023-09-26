import { CellRange, createCellRange } from '../table/cell-range.js';
import { CellCoord, createCellCoord } from '../table/cell-coord.js';

export class CellRangeList {
  private readonly ranges: CellRange[] = [];

  constructor(ranges?: CellRange[]) {
    if (ranges) this.ranges = ranges;
  }

  public getRanges(): CellRange[] {
    return this.ranges;
  }

  public hasRange(): boolean {
    return this.ranges.length > 0;
  }

  public addCell(rowId: number, colId: number): this {
    if (this.hasCell(rowId, colId)) return this;
    if (!this.updateLastRange(rowId, colId)) {
      this.ranges.push(createCellRange(createCellCoord(rowId, colId)));
    }
    this.mergeLastTwoRanges();
    return this;
  }

  private hasCell(rowId: number, colId: number): boolean {
    for (const range of this.ranges) {
      if (range.hasCell(rowId, colId)) {
        return true;
      }
    }
    return false;
  }

  private updateLastRange(rowId: number, colId: number): boolean {
    let lastRange: CellRange | undefined = this.getLastRange();
    const cellCoord: CellCoord = createCellCoord(rowId, colId);
    if (lastRange) {
      const canUpdate: boolean =
        rowId === lastRange.getFrom().getRowId() &&
        colId === lastRange.getTo().getColId() + 1;
      if (canUpdate) {
        lastRange = createCellRange(lastRange.getFrom(), cellCoord);
        this.ranges.splice(this.ranges.length - 1, 1, lastRange);
        return true;
      }
    } else {
      this.ranges.push(createCellRange(cellCoord));
      return true;
    }
    return false;
  }

  private getLastRange(): CellRange | undefined {
    return this.ranges.length > 0
      ? this.ranges[this.ranges.length - 1]
      : undefined;
  }

  private mergeLastTwoRanges(): void {
    const lRange: CellRange | undefined = this.getLastRange();
    if (!lRange) return;
    let pRange: CellRange | undefined = this.getPreviousRange();
    if (!pRange) return;
    const canMerge: boolean =
      pRange.getFrom().getColId() === lRange.getFrom().getColId() &&
      pRange.getTo().getColId() === lRange.getTo().getColId() &&
      pRange.getTo().getRowId() === lRange.getTo().getRowId() - 1;
    if (!canMerge) return;
    pRange = createCellRange(pRange.getFrom(), lRange.getTo());
    this.ranges.splice(this.ranges.length - 2, 2, pRange);
  }

  private getPreviousRange(): CellRange | undefined {
    return this.ranges.length >= 2
      ? this.ranges[this.ranges.length - 2]
      : undefined;
  }
}
