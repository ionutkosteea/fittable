import { TwoDimensionalMap } from 'fittable-core/common';
import {
  Value,
  Table,
  asTableStyles,
  Style,
  TableRows,
  TableCols,
  TableMergedRegions,
  asTableRows,
  asTableCols,
  asTableMergedRegions,
  TableStyles,
  asTableDataTypes,
  TableDataTypes,
  DataType,
  DataTypeName,
  TableData,
  asTableData,
} from 'fittable-core/model';
import {
  getViewModelConfig,
  TableViewer,
  TableViewerFactory,
  ViewModelConfig,
} from 'fittable-core/view-model';

export class FitTableViewer implements TableViewer {
  private width?: number;
  private height?: number;
  private rowPositions?: number[];
  private colPositions?: number[];
  private hiddenCells?: TwoDimensionalMap<boolean>;
  private config: ViewModelConfig;
  private tableRows?: TableRows;
  private tableCols?: TableCols;
  private tableMergedRegions?: TableMergedRegions;
  private tableStyles?: TableStyles;
  private tableDataTypes?: TableDataTypes;
  private tableData?: TableData;

  constructor(private table: Table) {
    this.config = getViewModelConfig();
    this.loadTable(table);
  }

  public loadTable(table: Table): this {
    this.table = table;
    this.tableRows = asTableRows(table);
    this.tableCols = asTableCols(table);
    this.tableMergedRegions = asTableMergedRegions(table);
    this.tableStyles = asTableStyles(table);
    this.tableDataTypes = asTableDataTypes(table);
    this.tableData = asTableData(table);
    this.resetRowProperties();
    this.resetColProperties();
    this.resetMergedRegions();
    return this;
  }

  public getNumberOfRows(): number {
    return this.table.getNumberOfRows();
  }

  public getNumberOfCols(): number {
    return this.table.getNumberOfCols();
  }

  public getColWidth(colId: number): number {
    return this.tableCols?.getColWidth(colId) ?? this.config.colWidths;
  }

  public getRowHeaderWidth(): number {
    return this.config.rowHeaderWidth ?? 0;
  }

  public getBodyWidth(): number {
    if (!this.width) this.width = this.calculateBodyWidth();
    return this.width;
  }

  private calculateBodyWidth(): number {
    let width = 0;
    for (let i = 0; i < this.table.getNumberOfCols(); i++) {
      width += this.getColWidth(i);
    }
    return width;
  }

  public getRowHeight(rowId: number): number {
    return this.tableRows?.getRowHeight(rowId) ?? this.config.rowHeights;
  }

  public getColHeaderHeight(): number {
    return this.config.colHeaderHeight ?? 0;
  }

  public getBodyHeight(): number {
    if (!this.height) this.height = this.calculateBodyHeight();
    return this.height;
  }

  private calculateBodyHeight(): number {
    let height = 0;
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      height += this.getRowHeight(i);
    }
    return height;
  }

  public getRowPosition(rowId: number): number {
    return this.getRowPositions()[rowId];
  }

  private getRowPositions(): number[] {
    if (!this.rowPositions) this.rowPositions = this.calculateRowPositions();
    return this.rowPositions;
  }

  private calculateRowPositions(): number[] {
    const positions: number[] = [];
    let position = 0;
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      positions.push(position);
      position += this.getRowHeight(i);
    }
    return positions;
  }

  public getColPosition(colId: number): number {
    return this.getColPositions()[colId];
  }

  private getColPositions(): number[] {
    if (!this.colPositions) {
      this.colPositions = this.calculateColPositions();
    }
    return this.colPositions;
  }

  private calculateColPositions(): number[] {
    const positions: number[] = [];
    let position = 0;
    for (let i = 0; i < this.table.getNumberOfCols(); i++) {
      positions.push(position);
      position += this.getColWidth(i);
    }
    return positions;
  }

  public getRowSpan(rowId: number, colId: number): number {
    return this.tableMergedRegions?.getRowSpan(rowId, colId) ?? 1;
  }

  public getMaxRowSpan(rowId: number): number {
    let maxRowSpan = 1;
    for (let i = 0; i < this.table.getNumberOfCols(); i++) {
      const rowSpan: number =
        this.tableMergedRegions?.getRowSpan(rowId, i) ?? 1;
      if (maxRowSpan < rowSpan) maxRowSpan = rowSpan;
    }
    return maxRowSpan;
  }

  public getColSpan(rowId: number, colId: number): number {
    return this.tableMergedRegions?.getColSpan(rowId, colId) ?? 1;
  }

  public getMaxColSpan(colId: number): number {
    let maxColSpan = 1;
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      const colSpan: number =
        this.tableMergedRegions?.getColSpan(i, colId) ?? 1;
      if (maxColSpan < colSpan) maxColSpan = colSpan;
    }
    return maxColSpan;
  }

  public isHiddenCell(rowId: number, colId: number): boolean {
    if (!this.hiddenCells) this.calculateHiddenCells();
    return this.hiddenCells?.getValue(rowId, colId) ?? false;
  }

  public hasHiddenCells4Row(rowId: number): boolean {
    if (!this.hiddenCells) this.calculateHiddenCells();
    return this.hiddenCells?.getRowValues(rowId) !== undefined;
  }

  public hasHiddenCells4Col(colId: number): boolean {
    if (!this.hiddenCells) this.calculateHiddenCells();
    for (const key of this.hiddenCells?.getRows() ?? []) {
      const rowId: number = key as unknown as number;
      const value: boolean | undefined = this.hiddenCells?.getValue(
        rowId,
        colId
      );
      if (value) return true;
    }
    return false;
  }

  private calculateHiddenCells(): void {
    this.hiddenCells = new TwoDimensionalMap();
    this.tableMergedRegions?.forEachMergedCell(
      (rowId: number, colId: number): void => {
        const rowSpan: number | undefined = //
          this.tableMergedRegions?.getRowSpan(rowId, colId);
        const toRowId: number = rowSpan ? rowId + rowSpan - 1 : rowId;
        const colSpan: number | undefined = //
          this.tableMergedRegions?.getColSpan(rowId, colId);
        const toColId: number = colSpan ? colId + colSpan - 1 : colId;
        for (let i = rowId; i <= toRowId; i++) {
          for (let j = colId; j <= toColId; j++) {
            if (i === rowId && j === colId) continue;
            this.hiddenCells?.setValue(i, j, true);
          }
        }
      }
    );
  }

  public forEachMergedCell(cell: (rowId: number, colId: number) => void): void {
    this.tableMergedRegions?.forEachMergedCell(cell);
  }

  public resetRowProperties(): this {
    this.height = undefined;
    this.rowPositions = undefined;
    return this;
  }

  public resetColProperties(): this {
    this.width = undefined;
    this.colPositions = undefined;
    return this;
  }

  public resetMergedRegions(): this {
    this.hiddenCells = undefined;
    return this;
  }

  public hasColHeader(): boolean {
    return this.config.colHeaderHeight ? true : false;
  }

  public hasRowHeader(): boolean {
    return this.config.rowHeaderWidth ? true : false;
  }

  public getCellStyle(rowId: number, colId: number): Style | undefined {
    const styleName: string | undefined =
      this.tableStyles?.getCellStyleName(rowId, colId);
    if (styleName) return asTableStyles(this.table)?.getStyle(styleName);
    else return undefined;
  }

  public getCellValue(rowId: number, colId: number): Value {
    if (this.tableData?.isDataRefPerspective()) {
      return this.tableData.getCellDataRef(rowId, colId) ?? '';
    }
    const value = this.table.getCellValue(rowId, colId);
    if (value !== undefined) return value;
    return '';
  }

  public getCellFormattedValue(rowId: number, colId: number): Value {
    if (this.tableData?.isDataRefPerspective()) {
      return this.tableData.getCellDataRef(rowId, colId) ?? '';
    }
    const formattedValue = this.tableDataTypes?.getCellFormattedValue(rowId, colId);
    if (formattedValue !== undefined) return formattedValue;
    const value = this.table.getCellValue(rowId, colId);
    if (value !== undefined) return value;
    return '';
  }

  public getCellDataType(rowId: number, colId: number): DataType | undefined {
    return this.tableDataTypes?.getCellDataType(rowId, colId);
  }

  public getCellType(rowId: number, colId: number): DataTypeName {
    return this.tableDataTypes?.getCellType(rowId, colId) ?? 'string';
  }
}

export class FitTableViewerFactory implements TableViewerFactory {
  public createTableViewer(table: Table): TableViewer {
    return new FitTableViewer(table);
  }
}
