import { incrementNumber, implementsTKeys } from 'fit-core/common/index.js';
import { RowHeader, RowHeaderFactory, Value } from 'fit-core/model/index.js';

import { FitRowHeaderDto } from './dto/fit-table-dto.js';

export class FitRowHeader implements RowHeader {
  private readonly dto: FitRowHeaderDto = { numberOfColumns: 0 };

  constructor(dto?: FitRowHeaderDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitRowHeaderDto {
    return this.dto;
  }

  public getNumberOfColumns(): number {
    return this.dto.numberOfColumns;
  }

  public setNumberOfColumns(numberOfColumns: number): this {
    this.dto.numberOfColumns = numberOfColumns;
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value {
    return incrementNumber(rowId);
  }

  public equals(other?: FitRowHeader): boolean {
    return this.getNumberOfColumns() === other?.getNumberOfColumns();
  }

  public clone(): FitRowHeader {
    return new FitRowHeader({ ...this.dto });
  }
}

export class FitRowHeaderFactory implements RowHeaderFactory {
  public createRowHeader(numberOfColumns: number): FitRowHeader {
    return new FitRowHeader({ numberOfColumns });
  }

  public createRowHeader4Dto(dto: FitRowHeaderDto): FitRowHeader {
    if (implementsTKeys<FitRowHeaderDto>(dto, ['numberOfColumns'])) {
      return new FitRowHeader(dto);
    } else {
      throw new Error('Invalid row header DTO.');
    }
  }
}
