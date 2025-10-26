import {
  Style,
  DataType,
  Table,
  Value,
  DataTypeName,
} from '../../../dist/model/index.js';
import { TableViewer } from '../../../dist/view-model/index.js';

export class TstTableViewer implements TableViewer {
  loadTable(table: Table): this {
    throw new Error('Method not implemented.');
  }
  getNumberOfRows(): number {
    throw new Error('Method not implemented.');
  }
  getNumberOfCols(): number {
    throw new Error('Method not implemented.');
  }
  hasRowHeader(): boolean {
    throw new Error('Method not implemented.');
  }
  getRowHeaderWidth(): number {
    throw new Error('Method not implemented.');
  }
  hasColHeader(): boolean {
    throw new Error('Method not implemented.');
  }
  getColHeaderHeight(): number {
    throw new Error('Method not implemented.');
  }
  getBodyWidth(): number {
    throw new Error('Method not implemented.');
  }
  getBodyHeight(): number {
    throw new Error('Method not implemented.');
  }
  getRowHeight(rowId: number): number {
    throw new Error('Method not implemented.');
  }
  getColWidth(colId: number): number {
    throw new Error('Method not implemented.');
  }
  getRowPosition(rowId: number): number {
    throw new Error('Method not implemented.');
  }
  getColPosition(colId: number): number {
    throw new Error('Method not implemented.');
  }
  getRowSpan(rowId: number, colId: number): number {
    throw new Error('Method not implemented.');
  }
  getMaxRowSpan(rowId: number): number {
    throw new Error('Method not implemented.');
  }
  getColSpan(rowId: number, colId: number): number {
    throw new Error('Method not implemented.');
  }
  getMaxColSpan(colId: number): number {
    throw new Error('Method not implemented.');
  }
  isHiddenCell(rowId: number, colId: number): boolean {
    throw new Error('Method not implemented.');
  }
  hasHiddenCells4Row(rowId: number): boolean {
    throw new Error('Method not implemented.');
  }
  hasHiddenCells4Col(colId: number): boolean {
    throw new Error('Method not implemented.');
  }
  forEachMergedCell(cell: (rowId: number, colId: number) => void): void {
    throw new Error('Method not implemented.');
  }
  getCellStyle(rowId: number, colId: number): Style | undefined {
    throw new Error('Method not implemented.');
  }
  getCellValue(rowId: number, colId: number): Value | undefined {
    throw new Error('Method not implemented.');
  }
  getCellDataType(rowId: number, colId: number): DataType | undefined {
    throw new Error('Method not implemented.');
  }
  getCellType(rowId: number, colId: number): DataTypeName {
    throw new Error('Method not implemented.');
  }
  getFormatedCellValue(rowId: number, colId: number): string | undefined {
    throw new Error('Method not implemented.');
  }
  resetRowProperties(): this {
    throw new Error('Method not implemented.');
  }
  resetColProperties(): this {
    throw new Error('Method not implemented.');
  }
  resetMergedRegions(): this {
    throw new Error('Method not implemented.');
  }
}
