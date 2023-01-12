import { RangeIterator } from '../../common/range-iterator.js';
import { Value } from '../../model/cell.js';
import { Style } from '../../model/style.js';
import { Table } from '../../model/table.js';
import { getViewModelConfig } from '../view-model-config.js';

export interface TableViewer {
  setTable(table: Table): this;
  getTable(): Table;
  hasRowHeader(): boolean;
  getRowHeaderColIds(): RangeIterator;
  getRowHeaderCellValue(rowId: number, colId: number): Value | undefined;
  getRowHeaderColumnWidth(colId: number): number;
  getRowHeaderWidth(): number;
  hasColumnHeader(): boolean;
  getColumnHeaderRowIds(): RangeIterator;
  getColumnHeaderCellValue(rowId: number, colId: number): Value | undefined;
  getColumnHeaderRowHeight(rowId: number): number;
  getColumnHeaderHeight(): number;
  getBodyWidth(): number;
  getBodyHeight(): number;
  getRowHeight(rowId: number): number;
  getColumnWidth(colId: number): number;
  getRowPosition(rowId: number): number;
  getColumnPosition(colId: number): number;
  getRowSpan(rowId: number, colId: number): number;
  getMaxRowSpan(rowId: number): number;
  getColSpan(rowId: number, colId: number): number;
  getMaxColSpan(colId: number): number;
  isHiddenCell(rowId: number, colId: number): boolean;
  hasHiddenCells4Row(rowId: number): boolean;
  hasHiddenCells4Column(colId: number): boolean;
  getCellStyle(rowId: number, colId: number): Style | undefined;
  getCellValue(rowId: number, colId: number): Value | undefined;
  resetRowProperties(): this;
  resetColumnProperties(): this;
  resetMergedRegions(): this;
}

export interface TableViewerFactory {
  createTableViewer(table: Table): TableViewer;
}

export function createTableViewer(table: Table): TableViewer {
  return getViewModelConfig().tableViewerFactory.createTableViewer(table);
}
