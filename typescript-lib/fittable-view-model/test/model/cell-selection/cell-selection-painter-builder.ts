import {} from 'jasmine';

import {
  Table,
  createTable,
  CellRange,
  createCellRange,
  createCellCoord,
  CellCoord,
} from 'fittable-core/model';
import {
  TableViewer,
  createTableViewer,
  CellSelection,
  createCellSelection,
  CellSelectionPainter,
  createCellSelectionPainter,
  CellSelectionRanges,
  ScrollContainer,
  createScrollContainer,
} from 'fittable-core/view-model';

export class CellSelectionPainterBuilder {
  private numberOfRows = 0;
  private numberOfCols = 0;
  private table!: Table;
  private tableViewer!: TableViewer;
  private tableScrollContainer!: ScrollContainer;
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

  public setNumberOfTableCols(numberOfCols: number): this {
    this.numberOfCols = numberOfCols;
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

  public selectColHeaderRange(from: CellCoord, to?: CellCoord): this {
    this.colHeaderCellSelectionRanges.push(createCellRange(from, to));
    return this;
  }

  public build(): CellSelectionPainter {
    this.table = this.createTable();
    this.tableViewer = createTableViewer(this.table);
    this.cellSelection = createCellSelection(this.tableViewer);
    this.tableScrollContainer = createScrollContainer();
    this.cellSelectionPainter = createCellSelectionPainter({
      tableViewer: this.tableViewer,
      tableScrollContainer: this.tableScrollContainer,
      cellSelection: this.cellSelection,
    });
    this.buildCellSelections();
    return this.cellSelectionPainter;
  }

  private createTable(): Table {
    return createTable()
      .setNumberOfRows(this.numberOfRows)
      .setNumberOfCols(this.numberOfCols);
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
      this.cellSelection.colHeader
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
