import {
  Table,
  Cell,
  TableRows,
  TableColumns,
  LineRange,
  asRowHeight,
  asColumnWidth,
} from 'fit-core/model/index.js';

export abstract class TableLinesHelper {
  constructor(protected readonly table: Table) {}

  public abstract getNumberOfLines(): number;

  public abstract getDimension(lineIndex: number): number | undefined;

  public abstract forEachLineCell(
    lineIndexes: LineRange,
    cellCoordFn: (rowId: number, colId: number) => void
  ): void;
}

export class TableRowsHelper extends TableLinesHelper {
  constructor(protected readonly table: Table) {
    super(table);
  }

  public forEachLineCell(
    rowIndexes: LineRange,
    cellCoordFn: (rowId: number, colId: number) => void
  ): void {
    for (let i = rowIndexes.getFrom(); i <= rowIndexes.getTo(); i++) {
      for (let j = 0; j < this.table.getNumberOfColumns(); j++) {
        const cell: Cell | undefined = this.table.getCell(i, j);
        cell && cellCoordFn(i, j);
      }
    }
  }

  public getNumberOfLines() {
    return this.table.getNumberOfRows();
  }

  public getDimension(rowId: number): number | undefined {
    return asRowHeight(this.getRowTable().getRow(rowId))?.getHeight();
  }

  private getRowTable(): Table & TableRows {
    return this.table as Table & TableRows;
  }
}

export class TableColumnsHelper extends TableLinesHelper {
  constructor(protected readonly table: Table) {
    super(table);
  }

  public forEachLineCell(
    columnIndexes: LineRange,
    cellCoordFn: (rowId: number, colId: number) => void
  ): void {
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      for (let j = columnIndexes.getFrom(); j <= columnIndexes.getTo(); j++) {
        const cell: Cell | undefined = this.table.getCell(i, j);
        cell && cellCoordFn(i, j);
      }
    }
  }

  public getNumberOfLines() {
    return this.table.getNumberOfColumns();
  }

  public getDimension(colId: number): number | undefined {
    return asColumnWidth(this.getColTable().getColumn(colId))?.getWidth();
  }

  private getColTable(): Table & TableColumns {
    return this.table as Table & TableColumns;
  }
}
