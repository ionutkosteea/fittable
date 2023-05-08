import { implementsTKeys } from '../../../dist/common/index.js';
import { CellCoord, CellCoordFactory } from '../../../dist/model/index.js';

import { TstCellCoordDto } from './dto/tst-table-dto.js';

export class TstCellCoord implements CellCoord {
  constructor(private readonly dto: TstCellCoordDto) {}

  public getDto(): TstCellCoordDto {
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

  public equals(other?: TstCellCoord): boolean {
    return (
      this.dto.rowId === other?.getRowId() &&
      this.dto.colId === other?.getColId()
    );
  }

  public clone(): TstCellCoord {
    return new TstCellCoord({ ...this.dto });
  }
}

export class TstCellCoordFactory implements CellCoordFactory {
  public createCellCoord(rowId: number, colId: number): TstCellCoord {
    return new TstCellCoord({ rowId, colId });
  }

  public createCellCoord4Dto(dto: TstCellCoordDto): TstCellCoord {
    if (implementsTKeys<TstCellCoordDto>(dto, ['rowId', 'colId'])) {
      return new TstCellCoord(dto);
    } else {
      throw new Error('Invalid cell coord DTO.');
    }
  }
}
