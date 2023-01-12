import { Value } from './cell.js';
import { getModelConfig } from './model-config.js';

interface Header {
  getDto(): unknown;
  getCellValue(rowId: number, colId: number): Value;
  hasProperties(): boolean;
  equals(other?: Header): boolean;
  clone(): Header;
}

export interface ColumnHeader extends Header {
  getNumberOfRows(): number;
  setNumberOfRows(numberOfRows: number): this;
}

export interface ColumnHeaderFactory {
  createColumnHeader(numberOfRows: number): ColumnHeader;
  createColumnHeader4Dto?(dto: unknown): ColumnHeader;
}

export function createColumnHeader<T extends ColumnHeader>(
  numberOfRows: number
): T {
  return getColumnHeaderFactory().createColumnHeader(numberOfRows) as T;
}

export function createColumnHeader4Dto<T extends ColumnHeader>(
  dto: unknown
): T {
  const factory: ColumnHeaderFactory = getColumnHeaderFactory();
  if (factory.createColumnHeader4Dto) {
    return factory.createColumnHeader4Dto(dto) as T;
  } else {
    throw new Error('ColumnHeaderFactory.createHeader4Dto is not defined!');
  }
}

function getColumnHeaderFactory(): ColumnHeaderFactory {
  const factory: ColumnHeaderFactory | undefined =
    getModelConfig().columnHeaderFactory;
  if (factory) return factory;
  else throw new Error('ColumnHeaderFactory is not defined!');
}

export interface RowHeader extends Header {
  getNumberOfColumns(): number;
  setNumberOfColumns(numberOfColumns: number): this;
}

export interface RowHeaderFactory {
  createRowHeader(numberOfColumns: number): RowHeader;
  createRowHeader4Dto?(dto: unknown): RowHeader;
}

export function createRowHeader<T extends RowHeader>(
  numberOfColumns: number
): T {
  return getRowHeaderFactory().createRowHeader(numberOfColumns) as T;
}

export function createRowHeader4Dto<T extends RowHeader>(dto: unknown): T {
  const factory: RowHeaderFactory = getRowHeaderFactory();
  if (factory.createRowHeader4Dto) return factory.createRowHeader4Dto(dto) as T;
  else throw new Error('RowHeaderFactory.createHeader4Dto is not defined!');
}

function getRowHeaderFactory(): RowHeaderFactory {
  const factory: RowHeaderFactory | undefined =
    getModelConfig().rowHeaderFactory;
  if (factory) return factory;
  else throw new Error('RowHeaderFactory is not defined!');
}
