import { ColumnFactory, ColumnWidth } from 'fit-core/model/index.js';

import { FitColumnDto } from './dto/fit-table-dto.js';

export class FitColumn implements ColumnWidth {
  private readonly dto: FitColumnDto = {};

  constructor(dto?: FitColumnDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitColumnDto {
    return this.dto;
  }

  public setWidth(value?: number): this {
    if (value) this.dto.width = value;
    else Reflect.deleteProperty(this.dto, 'width');
    return this;
  }

  public getWidth(): number | undefined {
    return this.dto.width;
  }

  public hasProperties(): boolean {
    return this.dto.width !== undefined;
  }

  public clone(): FitColumn {
    return new FitColumn({ ...this.dto });
  }

  public equals(other?: FitColumn): boolean {
    return this.getWidth() === other?.getWidth();
  }
}

export class FitColumnFactory implements ColumnFactory {
  public createColumn(): FitColumn {
    return new FitColumn();
  }

  public createColumn4Dto(dto: FitColumnDto): FitColumn {
    return new FitColumn(dto);
  }
}
