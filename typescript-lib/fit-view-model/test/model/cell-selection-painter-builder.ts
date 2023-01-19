import {} from 'jasmine';

import {
  Table,
  createTable,
  CellRange,
  createCellRange,
  createCellCoord,
  CellCoord,
} from 'fit-core/model/index.js';
import {
  TableViewer,
  createTableViewer,
  CellSelection,
  createCellSelection,
  CellSelectionPainter,
  createCellSelectionPainter,
  CellSelectionRanges,
} from 'fit-core/view-model/index.js';

export class CellSelectionPainterBuilder {
  private numberOfRows = 0;
  private numberOfColumns = 0;
  private hasRowHeaders = false;
  private hasColumnHeaders = false;
  private table!: Table;
  private tableViewer!: TableViewer;
  private cellSelection!: CellSelection;
  private cellSelectionPainter!: CellSelectionPainter;
  private bodyCellSelectionRanges: CellRange[] = [];
  private pageHeaderCellSelectionRanges: CellRange[] = [];
  private rowHeaderCellSelectionRanges: CellRange[] = [];
  private colHeaderCellSelectionRanges: CellRange[] = [];

  public setNumberOfTableRows(numberOfRows: number): this {
    this.numberOfRows = numberOfRows;
    return this;
  }

  public setNumberOfTableColumns(numberOfColumns: number): this {
    this.numberOfColumns = numberOfColumns;
    return this;
  }

  public setTableRowHeaders(headers: boolean): this {
    this.hasRowHeaders = headers;
    return this;
  }
  public setTableColumnHeaders(headers: boolean): this {
    this.hasColumnHeaders = headers;
    return this;
  }

  public selectBodyRange(from: CellCoord, to?: CellCoord): this {
    this.bodyCellSelectionRanges.push(createCellRange(from, to));
    return this;
  }

  public selectPageHeaderRange(from: CellCoord, to?: CellCoord): this {
    this.pageHeaderCellSelectionRanges.push(createCellRange(from, to));
    return this;
  }

  public selectRowHeaderRange(from: CellCoord, to?: CellCoord): this {
    this.rowHeaderCellSelectionRanges.push(createCellRange(from, to));
    return this;
  }

  public selectColumnHeaderRange(from: CellCoord, to?: CellCoord): this {
    this.colHeaderCellSelectionRanges.push(createCellRange(from, to));
    return this;
  }

  public build(): CellSelectionPainter {
    this.table = this.createTable();
    this.tableViewer = createTableViewer(this.table);
    this.cellSelection = createCellSelection(this.tableViewer);
    this.cellSelectionPainter = createCellSelectionPainter(
      this.tableViewer,
      this.cellSelection
    );
    this.buildCellSelections();
    return this.cellSelectionPainter;
  }

  private createTable(): Table {
    return createTable(this.numberOfRows, this.numberOfColumns);
  }

  private buildCellSelections(): void {
    if (!this.cellSelection) throw new Error('CellSelection is not defined!');
    this.selectCells(this.bodyCellSelectionRanges, this.cellSelection.body);
    this.selectCells(
      this.pageHeaderCellSelectionRanges,
      this.cellSelection.pageHeader
    );
    this.selectCells(
      this.rowHeaderCellSelectionRanges,
      this.cellSelection.rowHeader
    );
    this.selectCells(
      this.colHeaderCellSelectionRanges,
      this.cellSelection.columnHeader
    );
  }

  private selectCells(src: CellRange[], dest?: CellSelectionRanges): void {
    for (const range of src) {
      dest?.createRange();
      range.forEachCell((rowId: number, colId: number) =>
        dest?.addCell(createCellCoord(rowId, colId))
      );
    }
    dest?.end();
  }

  public destroy(): void {
    this.cellSelection.destroy();
    this.cellSelectionPainter.destroy();
  }
}
