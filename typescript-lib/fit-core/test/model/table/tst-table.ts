import { TableBasics, TableFactory } from '../../../dist/model/index.js';

import { TstTableDto, TstCellDto, TstRowDto } from './dto/tst-table-dto.js';

import { TstCell } from './tst-cell.js';

export class TstTable implements TableBasics {
  private readonly dto: TstTableDto = {
    numberOfRows: 0,
    numberOfColumns: 0,
    rows: {},
  };

  constructor(dto?: TstTableDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): TstTableDto {
    return this.dto;
  }

  public getNumberOfRows(): number {
    return this.dto.numberOfRows;
  }

  public setNumberOfRows(numberOfRows: number): this {
    this.dto.numberOfRows = numberOfRows;
    return this;
  }

  public getNumberOfColumns(): number {
    return this.dto.numberOfColumns;
  }

  public setNumberOfColumns(numberOfColumns: number): this {
    this.dto.numberOfColumns = numberOfColumns;
    return this;
  }

  public getCell(rowId: number, colId: number): TstCell | undefined {
    const cellDto: TstCellDto | undefined = this.dto.rows[rowId]?.cells[colId];
    return cellDto ? new TstCell(cellDto) : undefined;
  }

  public forEachCell(cellFn: (cell: TstCell) => void): void {
    for (const row of Reflect.ownKeys(this.dto.rows)) {
      const rowDto: TstRowDto = Reflect.get(this.dto.rows, row);
      for (const col of Reflect.ownKeys(rowDto.cells)) {
        const cellDto: TstCellDto = Reflect.get(rowDto.cells, col);
        cellFn(new TstCell(cellDto));
      }
    }
  }

  public forEachCellCoord(
    cellCoordFn: (rowId: number, colId: number) => void
  ): void {
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      for (let j = 0; j < this.getNumberOfColumns(); j++) {
        cellCoordFn(i, j);
      }
    }
  }

  public addCell(rowId: number, colId: number, cell: TstCell): this {
    if (!this.dto.rows[rowId]) this.dto.rows[rowId] = { cells: {} };
    this.dto.rows[rowId].cells[colId] = {
      value: cell.getValue(),
      format: cell.getFormat(),
    };
    return this;
  }

  public removeCell(rowId: number, colId: number): this {
    const rowDto: TstRowDto = this.dto.rows[rowId];
    if (rowDto) {
      const cellDto: TstCellDto = rowDto.cells[colId];
      if (cellDto) {
        Reflect.deleteProperty(rowDto.cells, colId);
      }
    }
    return this;
  }

  public clone(): TstTable {
    return new TstTable({ ...this.dto });
  }
}

export class TstTableFactory implements TableFactory {
  public createTable(numberOfRows: number, numberOfColumns: number): TstTable {
    return new TstTable()
      .setNumberOfRows(numberOfRows)
      .setNumberOfColumns(numberOfColumns);
  }
}
