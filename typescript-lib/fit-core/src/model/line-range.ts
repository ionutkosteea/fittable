import { getModelConfig } from './model-config.js';

export interface LineRange {
  getDto(): unknown;
  getFrom(): number;
  setFrom(from: number): this;
  getTo(): number;
  setTo(to?: number): this;
  getNumberOfLines(): number;
  forEachLine(callbackFn: (lineId: number) => void): void;
  contains(other: LineRange): boolean;
  clone(): LineRange;
  equals(other?: LineRange): boolean;
}

export interface LineRangeFactory {
  createLineRange(from: number, to?: number): LineRange;
  createLineRange4Dto?(dto: unknown): LineRange;
}

export function createLineRange<T extends LineRange>(
  from: number,
  to?: number
): T {
  return getModelConfig().lineRangeFactory.createLineRange(from, to) as T;
}

export function createLineRange4Dto<T extends LineRange>(dto: unknown): T {
  const factory: LineRangeFactory = getModelConfig().lineRangeFactory;
  if (factory.createLineRange4Dto) return factory.createLineRange4Dto(dto) as T;
  else throw new Error('LineRangeFactory.createLineRange4Dto is not defined!');
}

export function createLineRangeList4Dto(dtoList: unknown[]): LineRange[] {
  const rangeList: LineRange[] = [];
  dtoList.forEach((dto) => rangeList.push(createLineRange4Dto(dto)));
  return rangeList;
}

export function createDto4LineRangeList(rangeList: LineRange[]): unknown[] {
  const rangeDtoList: unknown[] = [];
  rangeList.forEach((range: LineRange): void => {
    range.getDto() && rangeDtoList.push(range.getDto());
  });
  return rangeDtoList;
}
