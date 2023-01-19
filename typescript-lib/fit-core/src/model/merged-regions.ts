import { CellCoord } from './cell-coord.js';
import { CellRangeBasics, CellRangeUpdater } from './cell-range.js';
import { getModelConfig } from './model-config.js';

export interface MergedRegion extends CellRangeBasics, CellRangeUpdater {
  getRowSpan(): number;
  getColSpan(): number;
}

export interface MergedRegions {
  getDto(): unknown;
  getRegion(rowId: number, colId: number): MergedRegion | undefined;
  getRowSpan(rowId: number, colId: number): number;
  getColSpan(rowId: number, colId: number): number;
  addRegion(from: CellCoord, to: CellCoord): this;
  removeRegion(rowId: number, colId: number): this;
  forEachRegion(regionFn: (region: MergedRegion) => void): void;
  hasProperties(): boolean;
  clone(): MergedRegions;
  equals(other?: MergedRegions): boolean;
}

export interface MergedRegionsFactory {
  createMergedRegions(): MergedRegions;
  createMergedRegions4Dto?(dto: unknown): MergedRegions;
}

export function createMergedRegions<T extends MergedRegions>(): T {
  return getFactory().createMergedRegions() as T;
}

export function createMergedRegions4Dto<T extends MergedRegions>(
  dto: unknown
): T {
  const factory: MergedRegionsFactory = getFactory();
  if (factory.createMergedRegions4Dto) {
    return factory.createMergedRegions4Dto(dto) as T;
  } else {
    throw new Error(
      'MergedRegionsFactory.createMergedRegions4Dto is not defined!'
    );
  }
}

function getFactory(): MergedRegionsFactory {
  const factory: MergedRegionsFactory | undefined =
    getModelConfig().mergedRegionsFactory;
  if (factory) return factory;
  else throw new Error('MergedRegionsFactory is not defined!');
}
