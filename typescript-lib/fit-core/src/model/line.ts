import { implementsTKeys } from '../common/core-functions.js';
import { getModelConfig } from './model-config.js';

export interface Line {
  getDto(): unknown;
  hasProperties(): boolean;
  clone(): Line;
  equals(other?: Line): boolean;
}

export interface RowHeight {
  getHeight(): number | undefined;
  setHeight(height?: number): this;
}

export type Row = Line & (RowHeight | {});

export interface RowFactory {
  createRow(): Row;
  createRow4Dto?(dto: unknown): Row;
}

export function createRow<T extends Row>(): T {
  return getRowFactory().createRow() as T;
}

export function createRow4Dto<T extends Row>(dto: unknown): T {
  const factory: RowFactory = getRowFactory();
  if (factory.createRow4Dto) return factory.createRow4Dto(dto) as T;
  else throw new Error('RowFactory.createRow4Dto is not defined!');
}

function getRowFactory(): RowFactory {
  const factory: RowFactory | undefined = getModelConfig().rowFactory;
  if (factory) return factory;
  else throw new Error('RowFactory is not defined!');
}

export function asRowHeight(row?: Row): RowHeight | undefined {
  return implementsTKeys<RowHeight>(row, ['getHeight'])
    ? (row as RowHeight)
    : undefined;
}

export interface ColumnWidth {
  getWidth(): number | undefined;
  setWidth(width?: number): this;
}

export type Column = Line & (ColumnWidth | {});

export interface ColumnFactory {
  createColumn(): Column;
  createColumn4Dto?(dto: unknown): Column;
}

export function createColumn<T extends Column>(): T {
  return getColumnFactory().createColumn() as T;
}

export function createColumn4Dto<T extends Column>(dto: unknown): T {
  const factory: ColumnFactory = getColumnFactory();
  if (factory.createColumn4Dto) return factory.createColumn4Dto(dto) as T;
  else throw new Error('ColumnFactory.createRow4Dto is not defined!');
}

function getColumnFactory(): ColumnFactory {
  const factory: ColumnFactory | undefined = getModelConfig().columnFactory;
  if (factory) return factory;
  else throw new Error('ColumnFactory is not defined!');
}

export function asColumnWidth(column?: Column): ColumnWidth | undefined {
  return implementsTKeys<ColumnWidth>(column, ['getWidth'])
    ? (column as ColumnWidth)
    : undefined;
}
