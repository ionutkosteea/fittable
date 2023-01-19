import { implementsTKeys } from '../common/core-functions.js';

import { Row, Column } from './line.js';
import { Cell } from './cell.js';
import { MergedRegions } from './merged-regions.js';
import { Style } from './style.js';
import { getModelConfig } from './model-config.js';

export interface TableBasics {
  getDto(): unknown;
  getNumberOfRows(): number;
  setNumberOfRows(numberOfRows: number): this;
  getNumberOfColumns(): number;
  setNumberOfColumns(numberOfColumns: number): this;
  getCell(rowId: number, colId: number): Cell | undefined;
  addCell(rowId: number, colId: number, cell: Cell): this;
  removeCell(rowId: number, colId: number): this;
  forEachCell(cellFn: (cell: Cell) => void): void;
  forEachCellCoord(cellCoordFn: (rowId: number, colId: number) => void): void;
  clone(): TableBasics;
}

export interface TableStyles {
  getStyle(name: string): Style | undefined;
  addStyle(name: string, style: Style): this;
  getStyleNames(): string[];
  removeStyle(name: string): this;
}

export interface TableRows {
  getRow(rowId: number): Row | undefined;
  addRow(rowId: number, row: Row): this;
  removeRow(rowId: number, ignoreCells?: boolean): this;
  moveRow(rowId: number, move: number, ignoreCells?: boolean): this;
}

export interface TableColumns {
  getColumn(colId: number): Column | undefined;
  addColumn(colId: number, column: Column): this;
  removeColumn(colId: number, ignoreCells?: boolean): this;
  moveColumn(colId: number, move: number, ignoreCells?: boolean): this;
}

export interface TableMergedRegions {
  getMergedRegions(): MergedRegions | undefined;
  setMergedRegions(regions?: MergedRegions): this;
}

export type Table = TableBasics &
  (TableStyles | TableRows | TableColumns | TableMergedRegions | {});

export interface TableFactory {
  createTable(numberOfRows: number, numberOfColumns: number): Table;
  createTable4Dto?(dto: unknown): Table;
}

export function createTable<T extends Table>(
  numberOfRows: number,
  numberOfColumns: number
): T {
  const factory: TableFactory = getModelConfig().tableFactory;
  return factory.createTable(numberOfRows, numberOfColumns) as T;
}

export function createTable4Dto<T extends Table>(dto: unknown): T {
  const factory: TableFactory = getModelConfig().tableFactory;
  if (factory.createTable4Dto) return factory.createTable4Dto(dto) as T;
  else throw new Error('TableFactory.createTable4Dto is not defined!');
}

export function asTableStyles(
  table?: Table
): (TableBasics & TableStyles) | undefined {
  return implementsTKeys<TableStyles>(table, ['getStyle'])
    ? (table as TableBasics & TableStyles)
    : undefined;
}

export function asTableRows(
  table?: Table
): (TableBasics & TableRows) | undefined {
  return implementsTKeys<TableRows>(table, ['getRow'])
    ? (table as TableBasics & TableRows)
    : undefined;
}

export function asTableColumns(
  table?: Table
): (TableBasics & TableColumns) | undefined {
  return implementsTKeys<TableColumns>(table, ['getColumn'])
    ? (table as TableBasics & TableColumns)
    : undefined;
}

export function asTableMergedRegions(
  table?: Table
): (TableBasics & TableMergedRegions) | undefined {
  return implementsTKeys<TableMergedRegions>(table, ['getMergedRegions'])
    ? (table as TableBasics & TableMergedRegions)
    : undefined;
}
