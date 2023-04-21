import { implementsTKeys } from 'fittable-core/common/index.js';
import { CellCoord, CellCoordFactory } from 'fittable-core/model/index.js';

import { FitCellCoordDto } from './dto/fit-table-dto.js';

export class FitCellCoord implements CellCoord {
  constructor(private readonly dto: FitCellCoordDto) {}

  public getDto(): FitCellCoordDto {
    return this.dto;
  }

  public getRowId(): number {
    return this.dto.rowId;
  }

  public setRowId(id: number): this {
    this.dto.rowId = id;
    return this;
  }

  public getColId(): number {
    return this.dto.colId;
  }

  public setColId(id: number): this {
    this.dto.colId = id;
    return this;
  }

  public equals(other?: FitCellCoord): boolean {
    return (
      this.getRowId() === other?.getRowId() &&
      this.getColId() === other?.getColId()
    );
  }

  public clone(): FitCellCoord {
    return new FitCellCoord({ ...this.dto });
  }
}

export class FitCellCoordFactory implements CellCoordFactory {
  public createCellCoord(rowId: number, colId: number): FitCellCoord {
    return new FitCellCoord({ rowId, colId });
  }

  public createCellCoord4Dto(dto: FitCellCoordDto): FitCellCoord {
    if (implementsTKeys<FitCellCoordDto>(dto, ['rowId', 'colId'])) {
      return new FitCellCoord(dto);
    } else {
      throw new Error('Invalid cell coordinates DTO.');
    }
  }
}
