import {
  createStyle4Dto,
  Style,
  TableBasics,
  TableCols,
  TableFactory,
  TableMergedRegions,
  TableRows,
  TableStyles,
  Value,
} from 'fit-core/model/index.js';

import {
  FitCellDto,
  FitColDto,
  FitMapDto,
  FitMergedCellDto,
  FitRowDto,
  FitTableDto,
} from './dto/fit-table-dto.js';

export class FitTable
  implements TableBasics, TableRows, TableCols, TableStyles, TableMergedRegions
{
  constructor(
    private readonly dto: FitTableDto = { numberOfRows: 5, numberOfCols: 5 }
  ) {}

  public getDto(): FitTableDto {
    return this.dto;
  }

  public getNumberOfRows(): number {
    return this.dto.numberOfRows ?? 0;
  }

  public setNumberOfRows(numberOfRows: number): this {
    this.dto.numberOfRows = numberOfRows;
    return this;
  }

  public getNumberOfCols(): number {
    return this.dto.numberOfCols ?? 0;
  }

  public setNumberOfCols(numberOfCols: number): this {
    this.dto.numberOfCols = numberOfCols;
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value | undefined {
    return this.getCellDto(rowId, colId)?.value;
  }

  public setCellValue(rowId: number, colId: number, value?: Value): this {
    if (value) {
      this.createMatrixCell('cells', rowId, colId);
      this.dto.cells![rowId][colId]['value'] = value;
    } else if (this.hasMatrixCell('cells', rowId, colId)) {
      delete this.dto.cells![rowId][colId]['value'];
      !this.hasCell(rowId, colId) && delete this.dto.cells![rowId][colId];
    }
    return this;
  }

  public hasCell(rowId: number, colId: number): boolean {
    return (
      this.getCellValue(rowId, colId) !== undefined ||
      this.getCellStyleName(rowId, colId) !== undefined
    );
  }

  public removeCell(rowId: number, colId: number): this {
    if (this.dto.cells && this.dto.cells[rowId]) {
      delete this.dto.cells[rowId][colId];
    }
    return this;
  }

  public forEachCell(cellFn: (rowId: number, colId: number) => void): void {
    for (let i = 0; i < (this.dto.numberOfRows ?? 0); i++) {
      for (let j = 0; j < (this.dto.numberOfCols ?? 0); j++) {
        cellFn(i, j);
      }
    }
  }

  public removeRowCells(rowId: number): this {
    this.dto.cells && delete this.dto.cells[rowId];
    return this;
  }

  public moveRowCells(rowId: number, move: number): this {
    if (this.dto.cells && this.dto.cells[rowId]) {
      const row: FitMapDto<FitCellDto> = { ...this.dto.cells[rowId] };
      delete this.dto.cells[rowId];
      this.dto.cells[rowId + move] = row;
    }
    return this;
  }

  public removeColCells(colId: number): this {
    if (this.dto.cells) {
      for (const rowId of Object.keys(this.dto.cells)) {
        delete this.dto.cells[rowId][colId];
      }
    }
    return this;
  }

  public moveColCells(colId: number, move: number): this {
    if (this.dto.cells) {
      for (const rowId of Object.keys(this.dto.cells)) {
        const row: FitMapDto<FitCellDto> = this.dto.cells[rowId];
        const cell: FitCellDto | undefined = row[colId] && { ...row[colId] };
        if (cell) {
          delete row[colId];
          row[colId + move] = cell;
        }
      }
    }
    return this;
  }

  public clone(): FitTable {
    return new FitTable({ ...this.dto });
  }

  public getColWidth(colId: number): number | undefined {
    return this.dto.cols && this.dto.cols[colId]?.width;
  }

  public setColWidth(colId: number, width?: number): this {
    if (width) {
      if (!this.dto.cols) this.dto.cols = {};
      if (!this.dto.cols[colId]) this.dto.cols[colId] = {};
      this.dto.cols[colId]['width'] = width;
    } else if (this.dto.cols && this.dto.cols[colId]) {
      delete this.dto.cols[colId]['width'];
      !this.hasCol(colId) && delete this.dto.cols[colId];
    }
    return this;
  }

  public hasCol(colId: number): boolean {
    return this.getColWidth(colId) !== undefined;
  }

  public removeCol(colId: number): this {
    this.dto.cols && delete this.dto.cols[colId];
    return this;
  }

  public moveCol(colId: number, move: number): this {
    if (this.dto.cols && this.dto.cols[colId]) {
      const col: FitColDto = { ...this.dto.cols[colId] };
      Reflect.deleteProperty(this.dto.cols, colId);
      this.dto.cols[colId + move] = col;
    }
    return this;
  }

  public getRowHeight(rowId: number): number | undefined {
    return this.dto.rows && this.dto.rows[rowId]?.height;
  }

  public setRowHeight(rowId: number, height?: number): this {
    if (height) {
      if (!this.dto.rows) this.dto.rows = {};
      if (!this.dto.rows[rowId]) this.dto.rows[rowId] = {};
      this.dto.rows[rowId]['height'] = height;
    } else if (this.dto.rows && this.dto.rows[rowId]) {
      delete this.dto.rows[rowId]['height'];
      !this.hasRow(rowId) && delete this.dto.rows[rowId];
    }
    return this;
  }

  public hasRow(rowId: number): boolean {
    return this.getRowHeight(rowId) !== undefined;
  }

  public removeRow(rowId: number): this {
    this.dto.rows && delete this.dto.rows[rowId];
    return this;
  }

  public moveRow(rowId: number, move: number): this {
    if (this.dto.rows && this.dto.rows[rowId]) {
      const row: FitRowDto = { ...this.dto.rows[rowId] };
      delete this.dto.rows[rowId];
      this.dto.rows[rowId + move] = row;
    }
    return this;
  }

  public getRowSpan(rowId: number, colId: number): number | undefined {
    return this.getMergedCellDto(rowId, colId)?.rowSpan;
  }

  public setRowSpan(rowId: number, colId: number, rowSpan?: number): this {
    if (rowSpan) {
      this.createMatrixCell('mergedCells', rowId, colId);
      this.dto.mergedCells![rowId][colId]['rowSpan'] = rowSpan;
    } else if (this.hasMatrixCell('mergedCells', rowId, colId)) {
      if (this.dto.mergedCells![rowId][colId]['colSpan']) {
        delete this.dto.mergedCells![rowId][colId]['rowSpan'];
      } else {
        delete this.dto.mergedCells![rowId][colId];
      }
    }
    return this;
  }

  public getColSpan(rowId: number, colId: number): number | undefined {
    return this.getMergedCellDto(rowId, colId)?.colSpan;
  }

  public setColSpan(rowId: number, colId: number, colSpan?: number): this {
    if (colSpan) {
      this.createMatrixCell('mergedCells', rowId, colId);
      this.dto.mergedCells![rowId][colId]['colSpan'] = colSpan;
    } else if (this.hasMatrixCell('mergedCells', rowId, colId)) {
      if (this.dto.mergedCells![rowId][colId]['rowSpan']) {
        delete this.dto.mergedCells![rowId][colId]['colSpan'];
      } else {
        delete this.dto.mergedCells![rowId][colId];
      }
    }
    return this;
  }

  public forEachRegion(cellFn: (rowId: number, colId: number) => void): void {
    if (!this.dto.mergedCells) return;
    for (const i of Object.keys(this.dto.mergedCells)) {
      for (const j of Object.keys(this.dto.mergedCells[i])) {
        cellFn(Number(i), Number(j));
      }
    }
  }

  public moveRegion(
    rowId: number,
    colId: number,
    moveRow: number,
    moveCol: number
  ): this {
    let rowSpan: number | undefined = this.getRowSpan(rowId, colId);
    let colSpan: number | undefined = this.getColSpan(rowId, colId);
    delete this.dto.mergedCells![rowId][colId];
    this.setRowSpan(rowId + moveRow, colId + moveCol, rowSpan);
    this.setColSpan(rowId + moveRow, colId + moveCol, colSpan);
    return this;
  }

  public increaseRegion(
    rowId: number,
    colId: number,
    increaseRow: number,
    increaseCol: number
  ): this {
    let rowSpan: number | undefined = this.getRowSpan(rowId, colId);
    this.setRowSpan(rowId, colId, rowSpan ? rowSpan + increaseRow : undefined);
    let colSpan: number | undefined = this.getColSpan(rowId, colId);
    this.setColSpan(rowId, colId, colSpan ? colSpan + increaseCol : undefined);
    return this;
  }

  public removeRowRegions(rowId: number): this {
    this.dto.mergedCells && delete this.dto.mergedCells[rowId];
    return this;
  }

  public removeColRegions(colId: number): this {
    if (this.dto.mergedCells) {
      for (const rowId of Object.keys(this.dto.mergedCells)) {
        delete this.dto.mergedCells[rowId][colId];
      }
    }
    return this;
  }

  public getStyle(name: string): Style | undefined {
    const styleDto = this.dto.styles && this.dto.styles[name];
    return styleDto && createStyle4Dto(styleDto);
  }

  public addStyle(name: string, style: Style): this {
    if (!this.dto.styles) this.dto.styles = {};
    this.dto.styles[name] = style.toCss();
    return this;
  }

  public getStyleNames(): string[] {
    return this.dto.styles ? Object.keys(this.dto.styles) : [];
  }

  public removeStyle(name: string): this {
    this.dto.styles && delete this.dto.styles[name];
    return this;
  }

  public getCellStyleName(rowId: number, colId: number): string | undefined {
    return this.getCellDto(rowId, colId)?.styleName;
  }

  public setCellStyleName(rowId: number, colId: number, name?: string): this {
    if (name) {
      this.createMatrixCell('cells', rowId, colId);
      this.dto.cells![rowId][colId]['styleName'] = name;
    } else if (this.hasMatrixCell('cells', rowId, colId)) {
      delete this.dto.cells![rowId][colId]['styleName'];
      !this.hasCell(rowId, colId) && delete this.dto.cells![rowId][colId];
    }
    return this;
  }

  private getCellDto(rowId: number, colId: number): FitCellDto | undefined {
    return (
      this.dto.cells && this.dto.cells![rowId] && this.dto.cells[rowId][colId]
    );
  }

  private getMergedCellDto(
    rowId: number,
    colId: number
  ): FitMergedCellDto | undefined {
    return (
      this.dto.mergedCells &&
      this.dto.mergedCells![rowId] &&
      this.dto.mergedCells[rowId][colId]
    );
  }

  private createMatrixCell(
    dtoKey: 'cells' | 'mergedCells',
    rowId: number,
    colId: number
  ): void {
    if (!this.dto[dtoKey]) this.dto[dtoKey] = {};
    if (!this.dto[dtoKey]![rowId]) this.dto[dtoKey]![rowId] = {};
    if (!this.dto[dtoKey]![rowId][colId]) this.dto[dtoKey]![rowId][colId] = {};
  }

  private hasMatrixCell(
    dtoKey: 'cells' | 'mergedCells',
    rowId: number,
    colId: number
  ): boolean {
    return this.dto[dtoKey] &&
      this.dto[dtoKey]![rowId] &&
      this.dto[dtoKey]![rowId][colId]
      ? true
      : false;
  }
}

export class FitTableFactory implements TableFactory {
  public createTable(): FitTable {
    return new FitTable();
  }

  public createTable4Dto(dto: FitTableDto): FitTable {
    return new FitTable(dto);
  }
}
