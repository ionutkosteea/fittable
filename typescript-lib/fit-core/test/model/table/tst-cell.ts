import { Value, CellFactory, CellBasics } from '../../../dist/model/cell.js';

import { TstCellDto, Format } from './dto/tst-table-dto.js';

export class TstCell implements CellBasics {
  private readonly dto: TstCellDto = {};

  constructor(dto?: TstCellDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): TstCellDto {
    return this.dto;
  }

  public getFormat(): Format | undefined {
    return this.dto?.format;
  }

  public setFormat(format?: Format): this {
    this.dto.format = format;
    return this;
  }

  public getValue(): Value | undefined {
    return this.dto?.value;
  }

  public setValue(value?: Value): this {
    this.dto.value = value;
    return this;
  }

  public hasProperties(): boolean {
    return this.dto.value !== undefined || this.dto.format !== undefined;
  }

  public clone(): TstCell {
    return new TstCell({ ...this.dto });
  }

  public equals(other?: TstCell): boolean {
    return (
      this.getValue() === other?.getValue() &&
      this.getFormat() === other?.getFormat()
    );
  }
}

export class TstCellFactory implements CellFactory {
  public createCell(): TstCell {
    return new TstCell();
  }
}
