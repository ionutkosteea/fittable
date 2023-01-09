import { implementsTKeys } from 'fit-core/common/index.js';
import { createCell4Dto, RowFactory, RowHeight } from 'fit-core/model/index.js';

import { FitRowDto, FitCellDto } from './dto/fit-table-dto.js';
import { FitCell } from './fit-cell.js';

export class FitRow implements RowHeight {
  private readonly dto: FitRowDto = { cells: {} };

  constructor(dto?: FitRowDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitRowDto {
    return this.dto;
  }

  public addCell(colId: number, cell: FitCell): this {
    this.dto.cells[colId] = cell.getDto();
    return this;
  }

  public removeCell(colId: number): this {
    if (Reflect.has(this.dto.cells, colId)) {
      Reflect.deleteProperty(this.dto.cells, colId);
    }
    return this;
  }

  public moveCell(colId: number, move: number): this {
    const cell: FitCell | undefined = this.getCell(colId);
    if (cell) {
      this.addCell(colId + move, cell);
      this.removeCell(colId);
    }
    return this;
  }

  public setHeight(value?: number): this {
    if (value) this.dto.height = value;
    else Reflect.deleteProperty(this.dto, 'height');
    return this;
  }

  public getHeight(): number | undefined {
    return this.dto.height;
  }

  public hasProperties(): boolean {
    return this.getNumberOfCells() > 0 || this.dto.height != undefined;
  }

  public getNumberOfCells(): number {
    const cells: string[] = Object.keys(this.dto.cells);
    return cells.length;
  }

  public getCell(colId: number): FitCell | undefined {
    const cellDto: FitCellDto = Reflect.get(this.dto.cells, colId);
    return cellDto ? createCell4Dto<FitCell>(cellDto) : undefined;
  }

  public clone(): FitRow {
    return new FitRow({ ...this.dto });
  }

  public equals(other?: FitRow): boolean {
    const hasEqualHeight: boolean = this.getHeight() === other?.getHeight();
    let hasEqualCells: boolean =
      this.getNumberOfCells() === other?.getNumberOfCells();
    for (let colId = 0; colId < this.getNumberOfCells(); colId++) {
      const cell: FitCell | undefined = this.getCell(colId);
      const otherCell: FitCell | undefined = other?.getCell(colId);
      if (cell) {
        if (!cell.equals(otherCell)) {
          hasEqualCells = false;
          break;
        }
      } else if (otherCell) {
        hasEqualCells = false;
        break;
      }
    }
    return hasEqualHeight && hasEqualCells;
  }
}

export class FitRowFactory implements RowFactory {
  public createRow(): FitRow {
    return new FitRow();
  }

  public createRow4Dto(dto: FitRowDto): FitRow {
    if (implementsTKeys<FitRowDto>(dto, ['cells'])) {
      return new FitRow(dto);
    } else {
      throw new Error('Invalid row DTO.');
    }
  }
}
