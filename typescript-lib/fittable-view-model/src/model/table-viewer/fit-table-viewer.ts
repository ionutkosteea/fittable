import { DoubleKeyMap } from 'fittable-core/common/index.js';
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
} from 'fittable-core/model/index.js';
import {
  getViewModelConfig,
  TableViewer,
  TableViewerFactory,
  ViewModelConfig,
} from 'fittable-core/view-model/index.js';

export class FitTableViewer implements TableViewer {
  private width?: number;
  private height?: number;
  private rowPositions?: number[];
  private colPositions?: number[];
  private hiddenCells?: DoubleKeyMap<boolean>;
  private config: ViewModelConfig;
  private rowTable?: TableRows;
  private colTable?: TableCols;
  private mergedRegionsTable?: TableMergedRegions;
  private styledTable?: TableStyles;

  constructor(private table: Table) {
    this.config = getViewModelConfig();
    this.loadTable(table);
  }

  public loadTable(table: Table): this {
    this.table = table;
    this.rowTable = asTableRows(table);
    this.colTable = asTableCols(table);
    this.mergedRegionsTable = asTableMergedRegions(table);
    this.styledTable = asTableStyles(table);
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
    return this.colTable?.getColWidth(colId) ?? this.config.colWidths;
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
    return this.rowTable?.getRowHeight(rowId) ?? this.config.rowHeights;
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
    return this.mergedRegionsTable?.getRowSpan(rowId, colId) ?? 1;
  }

  public getMaxRowSpan(rowId: number): number {
    let maxRowSpan = 1;
    for (let i = 0; i < this.table.getNumberOfCols(); i++) {
      const rowSpan: number =
        this.mergedRegionsTable?.getRowSpan(rowId, i) ?? 1;
      if (maxRowSpan < rowSpan) maxRowSpan = rowSpan;
    }
    return maxRowSpan;
  }

  public getColSpan(rowId: number, colId: number): number {
    return this.mergedRegionsTable?.getColSpan(rowId, colId) ?? 1;
  }

  public getMaxColSpan(colId: number): number {
    let maxColSpan = 1;
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      const colSpan: number =
        this.mergedRegionsTable?.getColSpan(i, colId) ?? 1;
      if (maxColSpan < colSpan) maxColSpan = colSpan;
    }
    return maxColSpan;
  }

  public isHiddenCell(rowId: number, colId: number): boolean {
    if (!this.hiddenCells) this.calculateHiddenCells();
    return this.hiddenCells?.get(rowId, colId) ?? false;
  }

  public hasHiddenCells4Row(rowId: number): boolean {
    if (!this.hiddenCells) this.calculateHiddenCells();
    return this.hiddenCells?.getAll(rowId) !== undefined;
  }

  public hasHiddenCells4Col(colId: number): boolean {
    if (!this.hiddenCells) this.calculateHiddenCells();
    for (const key of this.hiddenCells?.keys() ?? []) {
      const rowId: number = key as unknown as number;
      const value: boolean | undefined = this.hiddenCells?.get(rowId, colId);
      if (value) return true;
    }
    return false;
  }

  private calculateHiddenCells(): void {
    this.hiddenCells = new DoubleKeyMap();
    this.mergedRegionsTable?.forEachMergedCell(
      (rowId: number, colId: number): void => {
        const rowSpan: number | undefined = //
          this.mergedRegionsTable?.getRowSpan(rowId, colId);
        const toRowId: number = rowSpan ? rowId + rowSpan - 1 : rowId;
        const colSpan: number | undefined = //
          this.mergedRegionsTable?.getColSpan(rowId, colId);
        const toColId: number = colSpan ? colId + colSpan - 1 : colId;
        for (let i = rowId; i <= toRowId; i++) {
          for (let j = colId; j <= toColId; j++) {
            if (i === rowId && j === colId) continue;
            this.hiddenCells?.set(i, j, true);
          }
        }
      }
    );
  }

  public forEachMergedCell(cell: (rowId: number, colId: number) => void): void {
    this.mergedRegionsTable?.forEachMergedCell(cell);
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
    const styleName: string | undefined = //
      this.styledTable?.getCellStyleName(rowId, colId);
    if (styleName) return asTableStyles(this.table)?.getStyle(styleName);
    else return undefined;
  }

  public getCellValue(rowId: number, colId: number): Value | undefined {
    return this.table.getCellValue(rowId, colId);
  }
}

export class FitTableViewerFactory implements TableViewerFactory {
  public createTableViewer(table: Table): TableViewer {
    return new FitTableViewer(table);
  }
}
