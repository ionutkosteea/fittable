import { implementsTKeys } from 'fittable-core/common/index.js';
import {
  CellRange,
  CellRangeFactory,
  createCellCoord4Dto,
} from 'fittable-core/model/index.js';

import { FitCellRangeDto } from './dto/fit-table-dto.js';
import { FitCellCoord } from './fit-cell-coord.js';

export class FitCellRange implements CellRange {
  constructor(private readonly dto: FitCellRangeDto) {
    this.fromTopLeftToBottomRight();
  }

  public getDto(): FitCellRangeDto {
    return this.dto;
  }

  public getFrom(): FitCellCoord {
    return createCellCoord4Dto(this.dto.from);
  }

  public setFrom(from: FitCellCoord): this {
    this.dto.from = from.getDto();
    this.fromTopLeftToBottomRight();
    return this;
  }

  public getTo(): FitCellCoord {
    return this.dto.to ? createCellCoord4Dto(this.dto.to) : this.getFrom();
  }

  public setTo(to?: FitCellCoord): this {
    if (to) {
      if (this.getFrom().equals(to)) Reflect.deleteProperty(this.dto, 'to');
      else this.dto.to = to.getDto();
    } else {
      Reflect.deleteProperty(this.dto, 'to');
    }
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
    const from: FitCellCoord = this.getFrom();
    const to: FitCellCoord = this.getTo();
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

  public equals(other?: FitCellRange): boolean {
    return (
      this.getFrom().equals(other?.getFrom()) &&
      this.getTo().equals(other?.getTo())
    );
  }

  public clone(): FitCellRange {
    return new FitCellRange({ ...this.dto });
  }
}

export class FitCellRangeFactory implements CellRangeFactory {
  public createCellRange(from: FitCellCoord, to?: FitCellCoord): FitCellRange {
    return new FitCellRange({ from: from.getDto(), to: to?.getDto() });
  }

  public createCellRange4Dto(dto: FitCellRangeDto): FitCellRange {
    if (implementsTKeys<FitCellRangeDto>(dto, ['from'])) {
      return new FitCellRange(dto);
    } else {
      throw new Error('Invalid cell range DTO.');
    }
  }
}
