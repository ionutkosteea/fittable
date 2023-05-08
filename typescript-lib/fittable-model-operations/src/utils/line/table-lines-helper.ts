import {
  Table,
  LineRange,
  asTableRows,
  asTableCols,
} from 'fittable-core/model';

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
      for (let j = 0; j < this.table.getNumberOfCols(); j++) {
        this.table.hasCell(i, j) && cellCoordFn(i, j);
      }
    }
  }

  public getNumberOfLines() {
    return this.table.getNumberOfRows();
  }

  public getDimension(rowId: number): number | undefined {
    return asTableRows(this.table)?.getRowHeight(rowId);
  }
}

export class TableColsHelper extends TableLinesHelper {
  constructor(protected readonly table: Table) {
    super(table);
  }

  public forEachLineCell(
    colIndexes: LineRange,
    cellCoordFn: (rowId: number, colId: number) => void
  ): void {
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      for (let j = colIndexes.getFrom(); j <= colIndexes.getTo(); j++) {
        this.table.hasCell(i, j) && cellCoordFn(i, j);
      }
    }
  }

  public getNumberOfLines() {
    return this.table.getNumberOfCols();
  }

  public getDimension(colId: number): number | undefined {
    return asTableCols(this.table)?.getColWidth(colId);
  }
}
