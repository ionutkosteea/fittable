import { Value } from '../../../../dist/model/cell.js';

export interface TstTableDto {
  numberOfRows: number;
  numberOfColumns: number;
  rows: TstRowsDto;
}

export interface TstRowsDto {
  [row: number]: TstRowDto;
}

export interface TstRowDto {
  cells: TstCellsDto;
}

export interface TstCellsDto {
  [col: number]: TstCellDto;
}

export type Format = 'number' | 'date';

export interface TstCellDto {
  value?: Value;
  format?: Format;
}

export interface TstCellCoordDto {
  rowId: number;
  colId: number;
}

export interface TstCellRangeDto {
  from: TstCellCoordDto;
  to?: TstCellCoordDto;
}

export interface TstLineRangeDto {
  from: number;
  to?: number;
}
