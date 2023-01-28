import { CellCoord } from './cell-coord.js';
import { getModelConfig } from './model-config.js';

export interface CellRange {
  getDto(): unknown;
  getFrom(): CellCoord;
  setFrom(from: CellCoord): this;
  getTo(): CellCoord;
  setTo(to?: CellCoord): this;
  forEachCell(callbackFn: (rowId: number, colId: number) => void): void;
  hasCell(rowId: number, colId: number): boolean;
  equals(other?: CellRange): boolean;
  clone(): CellRange;
}

export interface CellRangeFactory {
  createCellRange(from: CellCoord, to?: CellCoord): CellRange;
  createCellRange4Dto?(dto: unknown): CellRange;
}

export function createCellRange<T extends CellRange>(
  from: CellCoord,
  to?: CellCoord
): T {
  return getModelConfig().cellRangeFactory.createCellRange(from, to) as T;
}

export function createCellRange4Dto<T extends CellRange>(dto: unknown): T {
  const factory: CellRangeFactory = getModelConfig().cellRangeFactory;
  if (factory.createCellRange4Dto) return factory.createCellRange4Dto(dto) as T;
  else throw new Error('CellRangeFactory.createCellRange4Dto is not defined!');
}

export function createCellRangeList4Dto(dtoList: unknown[]): CellRange[] {
  const rangeList: CellRange[] = [];
  dtoList.forEach((dto: unknown) => rangeList.push(createCellRange4Dto(dto)));
  return rangeList;
}

export function createDto4CellRangeList(rangeList: CellRange[]): unknown[] {
  const rangeDtoList: unknown[] = [];
  rangeList.forEach((range: CellRange) => rangeDtoList.push(range.getDto()));
  return rangeDtoList;
}
