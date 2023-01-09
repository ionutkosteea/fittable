import {
  Value,
  CellBasics,
  CellStyle,
  CellFactory,
} from 'fit-core/model/index.js';

import { FitCellDto } from './dto/fit-table-dto.js';

export class FitCell implements CellBasics, CellStyle {
  private readonly dto: FitCellDto = {};

  constructor(dto?: FitCellDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitCellDto {
    return this.dto;
  }

  public setStyleName(styleName?: string): this {
    if (styleName) this.dto.styleName = styleName;
    else Reflect.deleteProperty(this.dto, 'styleName');
    return this;
  }

  public getStyleName(): string | undefined {
    return this.dto.styleName;
  }

  public setValue(value?: Value): this {
    if (value) this.dto.value = value;
    else Reflect.deleteProperty(this.dto, 'value');
    return this;
  }

  public getValue(): Value | undefined {
    return this.dto.value;
  }

  public hasProperties(): boolean {
    return this.dto.value !== undefined || this.dto.styleName !== undefined;
  }

  public equals(other?: FitCell): boolean {
    return (
      this.getValue() === other?.getValue() &&
      this.getStyleName() === other?.getStyleName()
    );
  }

  public clone(): FitCell {
    return new FitCell({ ...this.dto });
  }
}

export class FitCellFactory implements CellFactory {
  public createCell(): FitCell {
    return new FitCell();
  }

  public createCell4Dto(dto: FitCellDto): FitCell {
    return new FitCell(dto);
  }
}
