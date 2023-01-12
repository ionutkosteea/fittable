import { Value } from 'fit-core/model/index.js';

export type FitTableDto = {
  numberOfRows: number;
  numberOfColumns: number;
  rows?: FitRowsDto;
  columns?: FitColumnsDto;
  styles?: FitStylesDto;
  mergedRegions?: FitCellRangeDto[];
  rowHeader?: FitRowHeaderDto;
  columnHeader?: FitColumnHeaderDto;
};

export type FitRowsDto = {
  [rowId: number]: FitRowDto;
};

export type FitRowDto = {
  cells?: FitCellsDto;
  height?: number;
};

export type FitCellsDto = {
  [colId: number]: FitCellDto;
};

export type FitCellDto = {
  value?: Value;
  styleName?: string;
};

export type FitColumnsDto = {
  [colId: number]: FitColumnDto;
};

export type FitColumnDto = {
  width?: number;
};

export type FitStylesDto = {
  [name: string]: FitStyleDto;
};

export type FitStyleDto = {
  'font-weight'?: string;
  'font-style'?: string;
  'text-decoration'?: string;
  'font-family'?: string;
  'font-size.px'?: number;
  color?: string;
  'background-color'?: string;
  'text-align'?: string;
  'place-items'?: string;
  'border-left'?: string;
  'border-right'?: string;
  'border-top'?: string;
  'border-bottom'?: string;
};

export type FitRowHeaderDto = {
  numberOfColumns: number;
};

export type FitColumnHeaderDto = {
  numberOfRows: number;
};

export type FitCellCoordDto = { rowId: number; colId: number };

export type FitCellRangeDto = { from: FitCellCoordDto; to?: FitCellCoordDto };

export type FitLineRangeDto = { from: number; to?: number };
