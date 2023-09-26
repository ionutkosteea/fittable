import { MissingFactoryMethodError } from '../../common/factory-error.js';
import { getModelConfig } from '../model-config.js';

export interface CellCoord {
  getDto(): unknown;
  getRowId(): number;
  setRowId(id: number): this;
  getColId(): number;
  setColId(id: number): this;
  equals(other?: CellCoord): boolean;
  clone(): CellCoord;
}

export interface CellCoordFactory {
  createCellCoord(rowId: number, colId: number): CellCoord;
  createCellCoord4Dto?(dto: unknown): CellCoord;
}

export function createCellCoord<T extends CellCoord>(
  rowId: number,
  colId: number
): T {
  return getModelConfig().cellCoordFactory.createCellCoord(rowId, colId) as T;
}

export function createCellCoord4Dto<T extends CellCoord>(dto: unknown): T {
  const factory: CellCoordFactory = getModelConfig().cellCoordFactory;
  if (factory.createCellCoord4Dto) return factory.createCellCoord4Dto(dto) as T;
  else throw new MissingFactoryMethodError();
}
