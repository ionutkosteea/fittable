import { Value } from '../../model/table.js';
import { Style } from '../../model/style.js';
import { Table } from '../../model/table.js';
import { getViewModelConfig } from '../view-model-config.js';

export interface TableViewer {
  setTable(table: Table): this;
  getTable(): Table;
  hasRowHeader(): boolean;
  getRowHeaderWidth(): number;
  hasColHeader(): boolean;
  getColHeaderHeight(): number;
  getBodyWidth(): number;
  getBodyHeight(): number;
  getRowHeight(rowId: number): number;
  getColWidth(colId: number): number;
  getRowPosition(rowId: number): number;
  getColPosition(colId: number): number;
  getRowSpan(rowId: number, colId: number): number;
  getMaxRowSpan(rowId: number): number;
  getColSpan(rowId: number, colId: number): number;
  getMaxColSpan(colId: number): number;
  isHiddenCell(rowId: number, colId: number): boolean;
  hasHiddenCells4Row(rowId: number): boolean;
  hasHiddenCells4Col(colId: number): boolean;
  getCellStyle(rowId: number, colId: number): Style | undefined;
  getCellValue(rowId: number, colId: number): Value | undefined;
  resetRowProperties(): this;
  resetColProperties(): this;
  resetMergedRegions(): this;
}

export interface TableViewerFactory {
  createTableViewer(table: Table): TableViewer;
}

export function createTableViewer(table: Table): TableViewer {
  return getViewModelConfig().tableViewerFactory.createTableViewer(table);
}
