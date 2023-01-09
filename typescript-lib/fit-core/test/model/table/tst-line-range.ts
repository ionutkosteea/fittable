import { implementsTKeys } from '../../../dist/common/index.js';
import { LineRange, LineRangeFactory } from '../../../dist/model/index.js';

import { TstLineRangeDto } from './dto/tst-table-dto.js';

export class TstLineRange implements LineRange {
  constructor(private readonly dto: TstLineRangeDto) {}

  public getDto(): TstLineRangeDto {
    return this.dto;
  }

  public getFrom(): number {
    return this.dto.from;
  }

  public setFrom(from: number): this {
    this.dto.from = from;
    return this;
  }

  public getTo(): number {
    return this.dto.to ?? this.dto.from;
  }

  public setTo(to?: number): this {
    if (to === this.dto.from) this.dto.to = undefined;
    else this.dto.to = to;
    return this;
  }

  public getNumberOfLines(): number {
    return this.getTo() + 1 - this.getFrom();
  }

  public forEachLine(itemFn: (index: number) => void): void {
    for (let i: number = this.getFrom(); i <= this.getTo(); i++) {
      itemFn(i);
    }
  }

  public contains(other: TstLineRange): boolean {
    return this.getFrom() <= other.getFrom() && this.getTo() >= other.getTo();
  }

  public clone(): TstLineRange {
    return new TstLineRange({ ...this.dto });
  }

  public equals(other?: TstLineRange): boolean {
    return other
      ? this.getFrom() === other.getFrom() && this.getTo() === other.getTo()
      : false;
  }
}

export class TstLineRangeFactory implements LineRangeFactory {
  public createLineRange(from: number, to?: number): TstLineRange {
    return new TstLineRange({ from, to });
  }

  public createLineRange4Dto(dto: TstLineRangeDto): TstLineRange {
    if (!implementsTKeys<TstLineRangeDto>(dto, ['from'])) {
      throw new Error('Invalid line range DTO.');
    }
    return new TstLineRange(dto);
  }
}
