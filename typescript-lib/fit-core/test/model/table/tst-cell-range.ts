import { implementsTKeys } from '../../../dist/common/index.js';
import {
  CellRangeBasics,
  CellRangeFactory,
} from '../../../dist/model/index.js';

import { TstCellRangeDto } from './dto/tst-table-dto.js';
import { TstCellCoord } from './tst-cell-coord.js';

export class TstCellRange implements CellRangeBasics {
  constructor(private readonly dto: TstCellRangeDto) {
    this.fromTopLeftToBottomRight();
  }

  public getDto(): TstCellRangeDto {
    return this.dto;
  }

  public getFrom(): TstCellCoord {
    return new TstCellCoord(this.dto.from);
  }

  public setFrom(from: TstCellCoord): this {
    this.dto.from = from.getDto();
    this.fromTopLeftToBottomRight();
    return this;
  }

  public getTo(): TstCellCoord {
    return this.dto.to ? new TstCellCoord(this.dto.to) : this.getFrom();
  }

  public setTo(to?: TstCellCoord): this {
    if (this.getFrom().equals(to)) this.dto.to = undefined;
    else this.dto.to = to?.getDto();
    this.fromTopLeftToBottomRight();
    return this;
  }

  private fromTopLeftToBottomRight(): void {
    if (!this.dto.to) return;
    let firstRow: number;
    let lastRow: number;
    let firstCol: number;
    let lastCol: number;
    if (this.dto.from.rowId < this.dto.to.rowId) {
      firstRow = this.dto.from.rowId;
      lastRow = this.dto.to.rowId;
    } else {
      firstRow = this.dto.to.rowId;
      lastRow = this.dto.from.rowId;
    }
    if (this.dto.from.colId < this.dto.to.colId) {
      firstCol = this.dto.from.colId;
      lastCol = this.dto.to.colId;
    } else {
      firstCol = this.dto.to.colId;
      lastCol = this.dto.from.colId;
    }
    this.dto.from = { rowId: firstRow, colId: firstCol };
    this.dto.to = { rowId: lastRow, colId: lastCol };
  }

  public forEachCell(
    cellCoordFn: (rowId: number, colId: number) => void
  ): void {
    const from: TstCellCoord = this.getFrom();
    const to: TstCellCoord = this.getTo();
    for (let i = from.getRowId(); i <= to.getRowId(); i++) {
      for (let j = from.getColId(); j <= to.getColId(); j++) {
        cellCoordFn(i, j);
      }
    }
  }

  public hasCell(rowId: number, colId: number): boolean {
    return (
      rowId >= this.getFrom().getRowId() &&
      rowId <= this.getTo().getRowId() &&
      colId >= this.getFrom().getColId() &&
      colId <= this.getTo().getColId()
    );
  }

  public getNumberOfCells(): number {
    let numberOfCells = 0;
    this.forEachCell(() => numberOfCells++);
    return numberOfCells;
  }

  public equals(other?: TstCellRange): boolean {
    return (
      this.getFrom().equals(other?.getFrom()) &&
      this.getTo().equals(other?.getTo())
    );
  }

  public clone(): TstCellRange {
    return new TstCellRange({ ...this.dto });
  }
}

export class TstCellRangeFactory implements CellRangeFactory {
  public createCellRange(from: TstCellCoord, to?: TstCellCoord): TstCellRange {
    return new TstCellRange({ from: from.getDto(), to: to?.getDto() });
  }

  public createCellRange4Dto(dto: TstCellRangeDto): TstCellRange {
    if (!implementsTKeys<TstCellRangeDto>(dto, ['from'])) {
      throw new Error('Invalid cell range DTO.');
    }
    return new TstCellRange(dto);
  }
}
