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
  ColConditionFn,
  TableColFilter,
} from 'fit-core/model/index.js';

import {
  FitCellDto,
  FitColDto,
  FitMapDto,
  FitMatrixDto,
  FitMergedCellDto,
  FitRowDto,
  FitTableDto,
} from './dto/fit-table-dto.js';

export class FitTable
  implements
    TableBasics,
    TableRows,
    TableCols,
    TableStyles,
    TableMergedRegions,
    TableColFilter
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
    if (value !== undefined) {
      this.createMatrixCell('cells', rowId, colId);
      this.getCells()[rowId][colId]['value'] = value;
    } else if (this.hasMatrixCell('cells', rowId, colId)) {
      delete this.getCells()[rowId][colId]['value'];
      !this.hasCell(rowId, colId) && delete this.getCells()[rowId][colId];
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
      this.getMergedCells()[rowId][colId]['rowSpan'] = rowSpan;
    } else if (this.hasMatrixCell('mergedCells', rowId, colId)) {
      if (this.getMergedCells()[rowId][colId]['colSpan']) {
        delete this.getMergedCells()[rowId][colId]['rowSpan'];
      } else {
        delete this.getMergedCells()[rowId][colId];
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
      this.getMergedCells()[rowId][colId]['colSpan'] = colSpan;
    } else if (this.hasMatrixCell('mergedCells', rowId, colId)) {
      if (this.getMergedCells()[rowId][colId]['rowSpan']) {
        delete this.getMergedCells()[rowId][colId]['colSpan'];
      } else {
        delete this.getMergedCells()[rowId][colId];
      }
    }
    return this;
  }

  public forEachMergedCell(
    cellFn: (rowId: number, colId: number) => void
  ): void {
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
    const rowSpan: number | undefined = this.getRowSpan(rowId, colId);
    const colSpan: number | undefined = this.getColSpan(rowId, colId);
    delete this.getMergedCells()[rowId][colId];
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
    const rowSpan: number | undefined = this.getRowSpan(rowId, colId);
    this.setRowSpan(rowId, colId, rowSpan ? rowSpan + increaseRow : undefined);
    const colSpan: number | undefined = this.getColSpan(rowId, colId);
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
      this.getCells()[rowId][colId]['styleName'] = name;
    } else if (this.hasMatrixCell('cells', rowId, colId)) {
      delete this.getCells()[rowId][colId]['styleName'];
      !this.hasCell(rowId, colId) && delete this.getCells()[rowId][colId];
    }
    return this;
  }

  private getCellDto(rowId: number, colId: number): FitCellDto | undefined {
    return (
      this.dto.cells && this.getCells()[rowId] && this.dto.cells[rowId][colId]
    );
  }

  private getMergedCellDto(
    rowId: number,
    colId: number
  ): FitMergedCellDto | undefined {
    return (
      this.dto.mergedCells &&
      this.getMergedCells()[rowId] &&
      this.getMergedCells()[rowId][colId]
    );
  }

  private createMatrixCell(
    dtoKey: 'cells' | 'mergedCells',
    rowId: number,
    colId: number
  ): void {
    let cells: FitMatrixDto<object> | undefined = this.dto[dtoKey];
    if (!cells) cells = this.dto[dtoKey] = {};
    let rows: FitMapDto<object> | undefined = cells[rowId];
    if (!rows) rows = cells[rowId] = {};
    let cell: object | undefined = rows[colId];
    if (!cell) cell = rows[colId] = {};
  }

  private hasMatrixCell(
    dtoKey: 'cells' | 'mergedCells',
    rowId: number,
    colId: number
  ): boolean {
    const cells: FitMatrixDto<object> | undefined = this.dto[dtoKey];
    if (!cells) return false;
    const rows: FitMapDto<object> | undefined = cells[rowId];
    return rows && rows[colId] ? true : false;
  }

  public filterByCol(colId: number, conditionFn: ColConditionFn): FitTable {
    let numberOfRows = 0;
    const filterDto: FitTableDto = {
      numberOfRows: numberOfRows,
      numberOfCols: this.dto.numberOfCols,
      styles: this.dto.styles,
      cols: this.dto.cols,
    };
    filterDto.cells = {};
    filterDto.rows = {};
    for (let rowId = 0; rowId < this.getNumberOfRows(); rowId++) {
      const value: Value | undefined = this.getCellValue(rowId, colId);
      if (!conditionFn(rowId, colId, value)) continue;
      if (this.getCells()[rowId]) {
        filterDto.cells[numberOfRows] = this.getCells()[rowId];
      }
      if (this.dto.rows && this.dto.rows[rowId]) {
        filterDto.rows[numberOfRows] = this.dto.rows[rowId];
      }
      numberOfRows++;
    }
    filterDto.numberOfRows = numberOfRows;
    return new FitTable(filterDto);
  }

  private getCells(): FitMatrixDto<FitCellDto> {
    if (this.dto.cells) return this.dto.cells;
    else throw new Error('Cells are not defined!');
  }

  private getMergedCells(): FitMatrixDto<FitMergedCellDto> {
    if (this.dto.mergedCells) return this.dto.mergedCells;
    else throw new Error('Merged cells are not defined!');
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
