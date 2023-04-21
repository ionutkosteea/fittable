import { implementsTKeys } from 'fittable-core/common/index.js';
import { LineRange, LineRangeFactory } from 'fittable-core/model/line-range.js';

import { FitLineRangeDto } from './dto/fit-table-dto.js';

export class FitLineRange implements LineRange {
  constructor(private readonly dto: FitLineRangeDto) {}

  public getDto(): FitLineRangeDto {
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
    if (to) {
      if (to === this.dto.from) Reflect.deleteProperty(this.dto, 'to');
      else this.dto.to = to;
    } else {
      Reflect.deleteProperty(this.dto, 'to');
    }
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

  public contains(other: FitLineRange): boolean {
    return this.getFrom() <= other.getFrom() && this.getTo() >= other.getTo();
  }

  public clone(): FitLineRange {
    return new FitLineRange({ ...this.dto });
  }

  public equals(other?: FitLineRange): boolean {
    return other
      ? this.getFrom() === other.getFrom() && this.getTo() === other.getTo()
      : false;
  }
}

export class FitLineRangeFactory implements LineRangeFactory {
  public createLineRange(from: number, to?: number): FitLineRange {
    return new FitLineRange({ from, to });
  }

  public createLineRange4Dto(dto: FitLineRangeDto): FitLineRange {
    if (implementsTKeys<FitLineRangeDto>(dto, ['from'])) {
      return new FitLineRange(dto);
    } else {
      throw new Error('Invalid line range DTO.');
    }
  }
}
