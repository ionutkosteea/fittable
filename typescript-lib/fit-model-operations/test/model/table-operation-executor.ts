import {
  registerModelConfig,
  Value,
  Table,
  createTable,
  Style,
  createStyle,
  TableStyles,
  TableRows,
  TableColumns,
  Cell,
  CellStyle,
  createCell,
  createLineRange,
  CellRangeList,
  LineRangeList,
  asRowHeight,
  asColumnWidth,
  CellRange,
  LineRange,
  createCellRange,
  createCellCoord,
} from 'fit-core/model/index.js';
import {
  OperationExecutor,
  createOperationExecutor,
  registerOperationConfig,
  OperationExecutorListener,
} from 'fit-core/operations/index.js';

import { fitModelConfig } from '../../../fit-model/dist/index.js';

import {
  fitOperationConfig,
  FitOperationDtoArgs,
  FitOperationStepId,
  BorderStyle,
} from '../../dist/index.js';

export type TstTable = Table & TableStyles & TableRows & TableColumns;

export type TstCell = Cell & CellStyle;

export class TableOperationExecutor {
  private table: TstTable;
  private readonly executor: OperationExecutor<
    FitOperationDtoArgs,
    FitOperationStepId
  >;
  private readonly selectedCells: CellRangeList;
  private readonly selectedRows: LineRangeList;
  private readonly selectedColumns: LineRangeList;

  constructor() {
    registerModelConfig(fitModelConfig);
    registerOperationConfig(fitOperationConfig);
    this.table = createTable<TstTable>(0, 0);
    this.executor = createOperationExecutor<
      FitOperationDtoArgs,
      FitOperationStepId
    >().setTable(this.table);
    this.selectedCells = new CellRangeList();
    this.selectedRows = new LineRangeList();
    this.selectedColumns = new LineRangeList();
  }

  public createTable(numberOfRows: number, numberOfColumns: number): this {
    this.table = createTable(numberOfRows, numberOfColumns) as TstTable;
    this.executor.setTable(this.table);
    return this;
  }

  public getTable(): Table {
    return this.table;
  }

  public addStyle(
    name: string,
    properties: { [name in string]?: string | number }
  ): this {
    const style: Style = createStyle();
    for (const name of Reflect.ownKeys(properties)) {
      style.set(name as string, Reflect.get(properties, name));
    }
    this.table.addStyle(name, style);
    return this;
  }

  public getStyle(styleName: string): Style | undefined {
    return this.table.getStyle(styleName);
  }

  public setCellStyleName(
    rowId: number,
    colId: number,
    styleName: string
  ): this {
    this.getCellAndCreateIfNotPresent(rowId, colId).setStyleName(styleName);
    return this;
  }

  private getCellAndCreateIfNotPresent(rowId: number, colId: number): TstCell {
    const cell: TstCell | undefined = this.table.getCell(
      rowId,
      colId
    ) as TstCell;
    if (!cell) this.table.addCell(rowId, colId, createCell());
    return this.table.getCell(rowId, colId) as TstCell;
  }

  public getCellStyleName(rowId: number, colId: number): string | undefined {
    return (this.table.getCell(rowId, colId) as TstCell)?.getStyleName();
  }

  public getNumberOfStyles(): number {
    return this.table.getStyleNames ? this.table.getStyleNames().length : 0;
  }

  public setCellValue(rowId: number, colId: number, value: Value): this {
    this.getCellAndCreateIfNotPresent(rowId, colId).setValue(value);
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value | undefined {
    return this.table.getCell(rowId, colId)?.getValue();
  }

  public selectCell(rowId: number, colId: number): this {
    this.selectedCells.addCell(rowId, colId);
    this.selectedRows.add(createLineRange(rowId));
    this.selectedColumns.add(createLineRange(colId));
    return this;
  }

  public getNumberOfRows(): number {
    return this.table.getNumberOfRows();
  }

  public getNumberOfColumns(): number {
    return this.table.getNumberOfColumns();
  }

  public getRowHeight(rowId: number): number {
    return asRowHeight(this.table.getRow(rowId))?.getHeight() ?? 0;
  }

  public getColumnWidth(colId: number): number {
    return asColumnWidth(this.table.getColumn(colId))?.getWidth() ?? 0;
  }

  public canUndo(): boolean {
    return this.executor.canUndo();
  }

  public runUndo(): this {
    this.executor.undo();
    return this;
  }

  public canRedo(): boolean {
    return this.executor.canRedo();
  }

  public addOperationListener(listener: OperationExecutorListener): this {
    this.executor.addListener(listener);
    return this;
  }

  public clearOperationListeners(): this {
    this.executor.clearListeners();
    return this;
  }

  public runRedo(): this {
    this.executor.redo();
    return this;
  }

  public runFontBold(isBold: boolean): this {
    const style: Style = isBold
      ? createStyle().set('font-weight', 'bold')
      : createStyle().set('font-weight', undefined);
    this.executor.run({
      id: 'style-update',
      selectedCells: this.getSelectedCells(),
      style,
    });
    return this;
  }

  public runPaintBorder(borderStyle: BorderStyle): this {
    this.executor.run({
      id: 'style-border',
      selectedCells: this.getSelectedCells(),
      borderStyle,
    });
    return this;
  }

  public runRemoveCells(): this {
    this.executor.run({
      id: 'cell-remove',
      selectedCells: this.getSelectedCells(),
    });
    return this;
  }

  public runInsertRowsBefore(numberOfRows: number): this {
    this.executor.run({
      id: 'row-insert',
      selectedLines: this.getSelectedRows(),
      numberOfInsertableLines: numberOfRows,
    });
    return this;
  }

  public runInsertRowsAfter(numberOfRows: number): this {
    this.executor.run({
      id: 'row-insert',
      selectedLines: this.getSelectedRows(),
      numberOfInsertableLines: numberOfRows,
      canInsertAfter: true,
    });
    return this;
  }

  public runRemoveRows(): this {
    this.executor.run({
      id: 'row-remove',
      selectedLines: this.getSelectedRows(),
    });
    return this;
  }

  public runResizeRows(height: number): this {
    this.executor.run({
      id: 'row-height',
      selectedLines: this.getSelectedRows(),
      dimension: height,
    });
    return this;
  }

  public runInsertColumnsBefore(numberOfColumns: number): this {
    this.executor.run({
      id: 'column-insert',
      selectedLines: this.getSelectedColumns(),
      numberOfInsertableLines: numberOfColumns,
    });
    return this;
  }

  public runInsertColumnsAfter(numberOfColumns: number): this {
    this.executor.run({
      id: 'column-insert',
      selectedLines: this.getSelectedColumns(),
      numberOfInsertableLines: numberOfColumns,
      canInsertAfter: true,
    });
    return this;
  }

  public runRemoveColumns(): this {
    this.executor.run({
      id: 'column-remove',
      selectedLines: this.getSelectedColumns(),
    });
    return this;
  }

  public runResizeColumns(width: number): this {
    this.executor.run({
      id: 'column-width',
      selectedLines: this.getSelectedColumns(),
      dimension: width,
    });
    return this;
  }

  public runRemoveCellStyles(): this {
    this.executor.run({
      id: 'style-remove',
      selectedCells: this.getSelectedCells(),
    });
    return this;
  }

  public runCellValue(
    rowId: number,
    colId: number,
    value: string | number | undefined
  ): this {
    this.executor.run({
      id: 'cell-value',
      selectedCells: [createCellRange(createCellCoord(rowId, colId))],
      value,
    });
    return this;
  }

  public runCellCopyValue(): this {
    this.executor.run({
      id: 'cell-copy',
      selectedCells: this.getSelectedCells(),
    });
    return this;
  }

  public runCellPasteValue(): this {
    this.executor.run({
      id: 'cell-paste',
      selectedCells: this.getSelectedCells(),
    });
    return this;
  }

  public runPaintFormat(sourceStyleName?: string): this {
    this.executor.run({
      id: 'style-name',
      selectedCells: this.getSelectedCells(),
      styleName: sourceStyleName,
    });
    return this;
  }

  private getSelectedCells(): CellRange[] {
    return this.selectedCells.getRanges();
  }

  private getSelectedRows(): LineRange[] {
    return this.selectedRows.getRanges();
  }

  private getSelectedColumns(): LineRange[] {
    return this.selectedColumns.getRanges();
  }
}
