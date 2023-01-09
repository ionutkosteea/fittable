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
  createCell4Dto,
  createColumnHeader4Dto,
  createRowHeader4Dto,
  createStyle4Dto,
  createRow4Dto,
  createMergedRegions4Dto,
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
    rowHeader: { numberOfColumns: 0 },
    columnHeader: { numberOfRows: 0 },
    rows: {},
    columns: {},
    styles: {},
    mergedRegions: [],
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
    return this;
  }

  public getRowHeader(): FitRowHeader {
    return createRowHeader4Dto(this.dto.rowHeader);
  }

  public setRowHeader(header: FitRowHeader): this {
    this.dto.rowHeader = header.getDto();
    return this;
  }

  public addStyle(name: string, style: FitStyle): this {
    this.dto.styles[name] = style.getDto();
    return this;
  }

  public getStyleNames(): string[] {
    return Reflect.ownKeys(this.dto.styles) as string[];
  }

  public getStyle(name: string): FitStyle | undefined {
    if (name) {
      const styleDto: FitStyleDto = this.dto.styles[name];
      return styleDto && createStyle4Dto<FitStyle>(styleDto);
    } else {
      return undefined;
    }
  }

  public removeStyle(name: string): this {
    if (Reflect.has(this.dto.styles, name)) {
      Reflect.deleteProperty(this.dto.styles, name);
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
    const rowDto: FitRowDto | undefined = this.dto.rows[rowId];
    return rowDto && createRow4Dto<FitRow>(rowDto);
  }

  public addRow(rowId: number, row: FitRow): this {
    if (rowId >= this.dto.numberOfRows) {
      throw new Error(
        'Row index has to be smaller than the total number of rows.'
      );
    }
    this.dto.rows[rowId] = row.getDto();
    return this;
  }

  public removeRow(rowId: number, ignoreCells?: boolean): this {
    const row: FitRow | undefined = this.getRow(rowId);
    if (ignoreCells && (row?.getNumberOfCells() ?? 0) > 0) row?.setHeight();
    else Reflect.deleteProperty(this.dto.rows, rowId);
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
    const columnDto: FitColumnDto | undefined = this.dto.columns[colId];
    return columnDto && new FitColumn(columnDto);
  }

  public addColumn(colId: number, column: FitColumn): this {
    if (colId >= this.dto.numberOfColumns) {
      throw new Error(
        'Column index has to be smaller than the total number of columns.'
      );
    }
    this.dto.columns[colId] = column.getDto();
    return this;
  }

  public removeColumn(colId: number, ignoreCells?: boolean): this {
    if (!ignoreCells) {
      for (const key of Reflect.ownKeys(this.dto.rows)) {
        const rowId: number = Number(key).valueOf();
        const row: FitRow = createRow4Dto(this.dto.rows[rowId]);
        row.removeCell(colId);
      }
    }
    if (Reflect.has(this.dto.columns, colId)) {
      Reflect.deleteProperty(this.dto.columns, colId);
    }
    return this;
  }

  public moveColumn(colId: number, move: number, ignoreCells?: boolean): this {
    if (move !== 0) {
      if (!ignoreCells) {
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
    const cellDto: FitCellDto | undefined = this.dto.rows[rowId]?.cells[colId];
    return cellDto && createCell4Dto<FitCell>(cellDto);
  }

  public forEachCell(cellFn: (cell: FitCell) => void): void {
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      const row: FitRowDto | undefined = this.dto.rows[i];
      for (let j = 0; j < this.getNumberOfColumns(); j++) {
        const cellDto: FitCellDto | undefined = row?.cells[j];
        cellDto && cellFn(createCell4Dto<FitCell>(cellDto));
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
    if (!this.dto.rows[rowId]) this.dto.rows[rowId] = { cells: {} };
    this.dto.rows[rowId].cells[colId] = {
      value: cell.getValue(),
      styleName: cell.getStyleName(),
    };
    return this;
  }

  public removeCell(rowId: number, colId: number): this {
    const rowDto: FitRowDto = this.dto.rows[rowId];
    if (rowDto) {
      const cellDto: FitCellDto = rowDto.cells[colId];
      cellDto && Reflect.deleteProperty(rowDto.cells, colId);
    }
    return this;
  }

  public setMergedRegions(mergedRegions: FitMergedRegions): this {
    this.dto.mergedRegions = mergedRegions.getDto();
    return this;
  }

  public getMergedRegions(): FitMergedRegions {
    return createMergedRegions4Dto(this.dto.mergedRegions);
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
