import { implementsTKeys } from '../common/core-functions.js';
import { getModelConfig } from './model-config.js';

export type Value = string | number;

export interface CellBasics {
  getDto(): unknown;
  getValue(): Value | undefined;
  setValue(value?: Value): this;
  hasProperties(): boolean;
  equals(other?: Cell): boolean;
  clone(): CellBasics;
}

export interface CellStyle {
  getStyleName(): string | undefined;
  setStyleName(name?: string): this;
}

export type Cell = CellBasics & (CellStyle | {});

export interface CellFactory {
  createCell(): Cell;
  createCell4Dto?(dto: unknown): Cell;
}

export function createCell<T extends Cell>(): T {
  return getModelConfig().cellFactory.createCell() as T;
}

export function createCell4Dto<T extends Cell>(dto: unknown): T {
  const factory: CellFactory = getModelConfig().cellFactory;
  if (factory.createCell4Dto) return factory.createCell4Dto(dto) as T;
  else throw new Error('CellFactory.createCell4Dto is not defined!');
}

export function asCellStyle(cell?: Cell): (CellBasics & CellStyle) | undefined {
  return implementsTKeys<CellStyle>(cell, ['getStyleName'])
    ? (cell as CellBasics & CellStyle)
    : undefined;
}
