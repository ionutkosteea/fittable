import { implementsTKeys } from '../../common/core-functions.js';
import { MissingFactoryMethodError } from '../../common/factory-error.js';
import { getModelConfig } from '../model-config.js';
import { DataType, DataTypeName } from './data-type.js';
import { Style } from './style.js';

export type Value = string | number | boolean;

export interface TableBasics {
  getDto(): unknown;
  getNumberOfRows(): number;
  setNumberOfRows(numberOfRows: number): this;
  getNumberOfCols(): number;
  setNumberOfCols(numberOfCols: number): this;
  getCellValue(rowId: number, colId: number): Value | undefined;
  setCellValue(rowId: number, colId: number, value?: Value): this;
  hasCell(rowId: number, colId: number): boolean;
  removeCell(rowId: number, colId: number): this;
  forEachCell(cellFn: (rowId: number, colId: number) => void): void;
  removeRowCells(rowId: number): this;
  moveRowCells(rowId: number, move: number): this;
  removeColCells(colId: number): this;
  moveColCells(colId: number, move: number): this;
  clone(): TableBasics;
}

export interface TableStyles {
  getStyle(name: string): Style | undefined;
  addStyle(name: string, style: Style): this;
  removeStyle(name: string): this;
  getStyleNames(): string[];
  getCellStyleName(rowId: number, colId: number): string | undefined;
  setCellStyleName(rowId: number, colId: number, name?: string): this;
}

export interface TableRows {
  getRowHeight(rowId: number): number | undefined;
  setRowHeight(rowId: number, height?: number): this;
  hasRow(rowId: number): boolean;
  removeRow(rowId: number): this;
  moveRow(rowId: number, move: number): this;
}

export interface TableCols {
  getColWidth(colId: number): number | undefined;
  setColWidth(colId: number, width?: number): this;
  hasCol(colId: number): boolean;
  removeCol(colId: number): this;
  moveCol(colId: number, move: number): this;
}

export interface TableMergedRegions {
  getRowSpan(rowId: number, colId: number): number | undefined;
  setRowSpan(rowId: number, colId: number, rowSpan?: number): this;
  getColSpan(rowId: number, colId: number): number | undefined;
  setColSpan(rowId: number, colId: number, colSpan?: number): this;
  forEachMergedCell(cellFn: (rowId: number, colId: number) => void): void;
  moveRegion(
    rowId: number,
    colId: number,
    moveRow: number,
    moveCol: number
  ): this;
  increaseRegion(
    rowId: number,
    colId: number,
    increaseRow: number,
    increaseCol: number
  ): this;
  removeRowRegions(rowId: number): this;
  removeColRegions(colId: number): this;
}

export type ColConditionFn = (
  rowId: number,
  colId: number,
  value?: Value
) => boolean;

export interface TableColFilter {
  filterByCol(
    colId: number,
    conditionFn: ColConditionFn
  ): TableBasics & TableColFilter;
}

export interface TableCellDataType {
  getLocale(): string;
  setLocale(locale: string): this;
  getCellDataType(rowId: number, colId: number): DataType | undefined;
  setCellDataType(rowId: number, colId: number, dataType?: DataType): this;
  getCellType(rowId: number, colId: number): DataTypeName;
  getFormatedCellValue(rowId: number, colId: number): string | undefined;
}

export type Table =
  | TableBasics
  | (TableBasics &
    (
      | TableStyles
      | TableRows
      | TableCols
      | TableMergedRegions
      | TableColFilter
      | TableCellDataType
    ));

export interface TableFactory {
  createTable(): Table;
  createTable4Dto?(dto: unknown): Table;
}

export function createTable<T extends Table>(): T {
  const factory: TableFactory = getModelConfig().tableFactory;
  return factory.createTable() as T;
}

export function createTable4Dto<T extends Table>(dto: unknown): T {
  const factory: TableFactory = getModelConfig().tableFactory;
  if (factory.createTable4Dto) return factory.createTable4Dto(dto) as T;
  else throw new MissingFactoryMethodError();
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
  return implementsTKeys<TableRows>(table, ['removeRow'])
    ? (table as TableBasics & TableRows)
    : undefined;
}

export function asTableCols(
  table?: Table
): (TableBasics & TableCols) | undefined {
  return implementsTKeys<TableCols>(table, ['removeCol'])
    ? (table as TableBasics & TableCols)
    : undefined;
}

export function asTableMergedRegions(
  table?: Table
): (TableBasics & TableMergedRegions) | undefined {
  return implementsTKeys<TableMergedRegions>(table, ['getRowSpan'])
    ? (table as TableBasics & TableMergedRegions)
    : undefined;
}

export function asTableColFilter(
  table?: Table
): (TableBasics & TableColFilter) | undefined {
  return implementsTKeys<TableColFilter>(table, ['filterByCol'])
    ? (table as TableBasics & TableColFilter)
    : undefined;
}

export function asTableCellDataType(
  table?: Table
): (TableBasics & TableCellDataType) | undefined {
  return implementsTKeys<TableCellDataType>(table, ['getCellDataType'])
    ? (table as TableBasics & TableCellDataType)
    : undefined;
}
