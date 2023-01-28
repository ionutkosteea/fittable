import { TableBasics, TableFactory, Value } from '../../../dist/model/index.js';

export class TstTable implements TableBasics {
  constructor(private readonly dto: (Value | undefined)[][] = []) {}

  public getDto(): (Value | undefined)[][] {
    return this.dto;
  }

  public getNumberOfRows(): number {
    return this.dto.length;
  }

  public setNumberOfRows(numberOfRows: number): this {
    this.dto.length = numberOfRows;
    return this;
  }

  public getNumberOfCols(): number {
    let numberOfCols = 0;
    for (const row of this.dto) {
      if (numberOfCols < row.length) numberOfCols = row.length;
    }
    return numberOfCols;
  }

  public setNumberOfCols(numberOfCols: number): this {
    for (const row of this.dto) {
      if (!row) continue;
      row.length = numberOfCols;
    }
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value | undefined {
    const row: (Value | undefined)[] | undefined = this.dto[rowId];
    return row ? row[colId] : undefined;
  }

  public setCellValue(rowId: number, colId: number, value?: Value): this {
    if (!this.dto[rowId]) this.dto[rowId] = [];
    this.dto[rowId][colId] = value;
    return this;
  }

  public hasCell(rowId: number, colId: number): boolean {
    return this.getCellValue(rowId, colId) !== undefined;
  }

  public removeCell(rowId: number, colId: number): this {
    this.setCellValue(rowId, colId);
    return this;
  }

  public forEachCell(cellFn: (rowId: number, colId: number) => void): void {
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      for (let j = 0; j < this.getNumberOfCols(); j++) {
        cellFn(i, j);
      }
    }
  }

  public removeRowCells(rowId: number): this {
    return this;
  }

  public moveRowCells(rowId: number, move: number): this {
    return this;
  }

  public removeColCells(colId: number): this {
    return this;
  }

  public moveColCells(colId: number, move: number): this {
    return this;
  }

  public clone(): TstTable {
    return new TstTable(JSON.parse(JSON.stringify(this.dto)));
  }
}

export class TstTableFactory implements TableFactory {
  public createTable(): TstTable {
    return new TstTable();
  }
}
