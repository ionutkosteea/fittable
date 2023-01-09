import { incrementLetter, implementsTKeys } from 'fit-core/common/index.js';
import {
  ColumnHeader,
  ColumnHeaderFactory,
  Value,
} from 'fit-core/model/index.js';

import { FitColumnHeaderDto } from './dto/fit-table-dto.js';

export class FitColumnHeader implements ColumnHeader {
  private readonly dto: FitColumnHeaderDto = { numberOfRows: 0 };

  constructor(dto?: FitColumnHeaderDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitColumnHeaderDto {
    return this.dto;
  }

  public getNumberOfRows(): number {
    return this.dto.numberOfRows;
  }

  public setNumberOfRows(numberOfRows: number): this {
    this.dto.numberOfRows = numberOfRows;
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value {
    return incrementLetter(colId);
  }

  public equals(other?: FitColumnHeader): boolean {
    return this.getNumberOfRows() === other?.getNumberOfRows();
  }

  public clone(): FitColumnHeader {
    return new FitColumnHeader({ ...this.dto });
  }
}

export class FitColumnHeaderFactory implements ColumnHeaderFactory {
  public createColumnHeader(numberOfRows: number): FitColumnHeader {
    return new FitColumnHeader({ numberOfRows });
  }

  public createColumnHeader4Dto(dto: FitColumnHeaderDto): FitColumnHeader {
    if (implementsTKeys<FitColumnHeaderDto>(dto, ['numberOfRows'])) {
      return new FitColumnHeader(dto);
    } else {
      throw new Error('Invalid column header DTO.');
    }
  }
}
