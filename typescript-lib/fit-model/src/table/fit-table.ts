import { implementsTKeys } from 'fit-core/common/index.js';
import {
  TableBasics,
  TableMergedRegions,
  TableRowHeader,
  TableColumnHeader,
  TableStyles,
  TableRows,
  TableColumns,
  TableFactory,
  createColumnHeader4Dto,
  createRowHeader4Dto,
  createStyle4Dto,
  createRow4Dto,
  createMergedRegions4Dto,
  createRow,
} from 'fit-core/model/index.js';

import {
  FitTableDto,
  FitRowDto,
  FitColumnDto,
  FitCellDto,
  FitStyleDto,
} from './dto/fit-table-dto.js';
import { FitRow } from './fit-row.js';
import { FitColumn } from './fit-column.js';
import { FitCell } from './fit-cell.js';
import { FitMergedRegions } from './fit-merged-regions.js';
import { FitStyle } from './fit-style.js';
import { FitColumnHeader } from './fit-column-header.js';
import { FitRowHeader } from './fit-row-header.js';

export class FitTable
  implements
    TableBasics,
    TableStyles,
    TableRows,
    TableColumns,
    TableMergedRegions,
    TableRowHeader,
    TableColumnHeader
{
  private readonly dto: FitTableDto = {
    numberOfRows: 0,
    numberOfColumns: 0,
  };

  public constructor(dto?: FitTableDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitTableDto {
    return this.dto;
  }

  public getColumnHeader(): FitColumnHeader {
    return createColumnHeader4Dto(this.dto.columnHeader);
  }

  public setColumnHeader(header: FitColumnHeader): this {
    this.dto.columnHeader = header.getDto();
    if (!header?.hasProperties()) {
      Reflect.deleteProperty(this.dto, 'columnHeader');
    }
    return this;
  }

  public getRowHeader(): FitRowHeader | undefined {
    return (
      this.dto.rowHeader &&
      createRowHeader4Dto<FitRowHeader>(this.dto.rowHeader)
    );
  }

  public setRowHeader(header?: FitRowHeader): this {
    this.dto.rowHeader = header?.getDto();
    if (!header?.hasProperties()) Reflect.deleteProperty(this.dto, 'rowHeader');
    return this;
  }

  public addStyle(name: string, style: FitStyle): this {
    if (!this.dto.styles) this.dto.styles = {};
    this.dto.styles[name] = style.getDto();
    return this;
  }

  public getStyleNames(): string[] {
    return this.dto.styles
      ? (Reflect.ownKeys(this.dto.styles) as string[])
      : [];
  }

  public getStyle(name: string): FitStyle | undefined {
    if (!this.dto.styles) return undefined;
    const styleDto: FitStyleDto = this.dto.styles[name];
    return styleDto && createStyle4Dto<FitStyle>(styleDto);
  }

  public removeStyle(name: string): this {
    if (this.dto.styles && Reflect.has(this.dto.styles, name)) {
      Reflect.deleteProperty(this.dto.styles, name);
      if (Object.keys(this.dto.styles).length <= 0) {
        Reflect.deleteProperty(this.dto, 'styles');
      }
    }
    return this;
  }

  public getNumberOfRows(): number {
    return this.dto.numberOfRows;
  }

  public setNumberOfRows(numberOfRows: number): this {
    this.dto.numberOfRows = numberOfRows;
    return this;
  }

  public getRow(rowId: number): FitRow | undefined {
    const rowDto: FitRowDto | undefined = this.dto.rows && this.dto.rows[rowId];
    return rowDto && createRow4Dto<FitRow>(rowDto);
  }

  public addRow(rowId: number, row: FitRow): this {
    if (rowId >= this.dto.numberOfRows) {
      throw new Error(
        'Row index has to be smaller than the total number of rows.'
      );
    }
    if (!this.dto.rows) this.dto.rows = {};
    this.dto.rows[rowId] = row.getDto();
    return this;
  }

  public removeRow(rowId: number, ignoreCells?: boolean): this {
    const row: FitRow | undefined = this.getRow(rowId);
    if (row) {
      if (ignoreCells && row.getNumberOfCells() > 0) {
        row?.setHeight();
      } else {
        Reflect.deleteProperty(this.dto.rows!, rowId);
        if (Object.keys(this.dto.rows!).length <= 0) {
          Reflect.deleteProperty(this.dto, 'rows');
        }
      }
    }
    return this;
  }

  public moveRow(rowId: number, move: number, ignoreCells?: boolean): this {
    if (move !== 0) {
      const row: FitRow | undefined = this.getRow(rowId)?.clone();
      if (row) {
        this.removeRow(rowId, ignoreCells);
        this.addRow(rowId + move, row);
      }
    }
    return this;
  }

  public getNumberOfColumns(): number {
    return this.dto.numberOfColumns;
  }

  public setNumberOfColumns(numberOfColumns: number): this {
    this.dto.numberOfColumns = numberOfColumns;
    return this;
  }

  public getColumn(colId: number): FitColumn | undefined {
    const columnDto: FitColumnDto | undefined =
      this.dto.columns && this.dto.columns[colId];
    return columnDto && new FitColumn(columnDto);
  }

  public addColumn(colId: number, column: FitColumn): this {
    if (colId >= this.dto.numberOfColumns) {
      throw new Error(
        'Column index has to be smaller than the total number of columns.'
      );
    }
    if (!this.dto.columns) this.dto.columns = {};
    this.dto.columns[colId] = column.getDto();
    return this;
  }

  public removeColumn(colId: number, ignoreCells?: boolean): this {
    if (!ignoreCells && this.dto.rows) {
      for (const key of Reflect.ownKeys(this.dto.rows)) {
        const rowId: number = Number(key).valueOf();
        const row: FitRow = createRow4Dto(this.dto.rows[rowId]);
        row.removeCell(colId);
      }
    }
    if (this.dto.columns && Reflect.has(this.dto.columns, colId)) {
      Reflect.deleteProperty(this.dto.columns, colId);
      if (Object.keys(this.dto.columns).length <= 0) {
        Reflect.deleteProperty(this.dto, 'columns');
      }
    }
    return this;
  }

  public moveColumn(colId: number, move: number, ignoreCells?: boolean): this {
    if (move !== 0) {
      if (!ignoreCells && this.dto.rows) {
        for (const key of Reflect.ownKeys(this.dto.rows)) {
          const rowId: number = Number(key).valueOf();
          const row: FitRow = createRow4Dto(this.dto.rows[rowId]);
          row.moveCell(colId, move);
        }
      }
      const column: FitColumn | undefined = this.getColumn(colId);
      if (column) {
        this.removeColumn(colId, ignoreCells);
        this.addColumn(colId + move, column);
      }
    }
    return this;
  }

  public getCell(rowId: number, colId: number): FitCell | undefined {
    const row: FitRow | undefined = this.getRow(rowId);
    return row && row.getCell(colId);
  }

  public forEachCell(cellFn: (cell: FitCell) => void): void {
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      for (let j = 0; j < this.getNumberOfColumns(); j++) {
        const cell: FitCell | undefined = this.getCell(i, j);
        cell && cellFn(cell);
      }
    }
  }

  public forEachCellCoord(
    cellIdFn: (rowId: number, colId: number) => void
  ): void {
    for (let i = 0; i < this.dto.numberOfRows; i++) {
      for (let j = 0; j < this.dto.numberOfColumns; j++) {
        cellIdFn(i, j);
      }
    }
  }

  public addCell(rowId: number, colId: number, cell: FitCell): this {
    const row: FitRow | undefined = this.getRow(rowId);
    if (!row) this.addRow(rowId, createRow<FitRow>().addCell(colId, cell));
    else row.addCell(colId, cell);
    return this;
  }

  public removeCell(rowId: number, colId: number): this {
    const row: FitRow | undefined = this.getRow(rowId);
    if (row) {
      row.removeCell(colId);
      if (!row.hasProperties()) {
        Reflect.deleteProperty(this.dto.rows!, rowId);
        if (Object.keys(this.dto.rows!).length <= 0) {
          Reflect.deleteProperty(this.dto, 'rows');
        }
      }
    }
    return this;
  }

  public setMergedRegions(mergedRegions?: FitMergedRegions): this {
    this.dto.mergedRegions = mergedRegions?.getDto();
    !this.dto.mergedRegions &&
      Reflect.deleteProperty(this.dto, 'mergedRegions');
    return this;
  }

  public getMergedRegions(): FitMergedRegions | undefined {
    return (
      this.dto.mergedRegions &&
      createMergedRegions4Dto<FitMergedRegions>(this.dto.mergedRegions)
    );
  }

  public clone(): FitTable {
    return new FitTable({ ...this.dto });
  }
}

export class FitTableFactory implements TableFactory {
  public createTable(numberOfRows: number, numberOfColumns: number): FitTable {
    return new FitTable()
      .setNumberOfRows(numberOfRows)
      .setNumberOfColumns(numberOfColumns);
  }

  public createTable4Dto(dto: FitTableDto): FitTable {
    const isValidDto: boolean = implementsTKeys<FitTableDto>(dto, [
      'numberOfRows',
      'numberOfColumns',
    ]);
    if (isValidDto) return new FitTable(dto);
    else throw new Error('Invalid table DTO.');
  }
}
