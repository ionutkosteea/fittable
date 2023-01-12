import { incrementNumber } from 'fit-core/common/index.js';
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
    return this.dto.numberOfColumns ?? 0;
  }

  public setNumberOfColumns(numberOfColumns: number): this {
    this.dto.numberOfColumns = numberOfColumns;
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value {
    return incrementNumber(rowId);
  }

  public hasProperties(): boolean {
    return this.dto['numberOfColumns'] > 0;
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
    return new FitRowHeader(dto);
  }
}
