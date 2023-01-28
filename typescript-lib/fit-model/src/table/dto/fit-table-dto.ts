import { Value } from 'fit-core/model/index.js';

export type FitMapDto<Val> = { [key: string]: Val };

export type FitRowDto = { height?: number };

export type FitColDto = { width?: number };

export type FitCellDto = { value?: Value; styleName?: string };

export type FitMergedCellDto = { rowSpan?: number; colSpan?: number };

export type FitMatrixDto<Cell> = { [rowId: string]: FitMapDto<Cell> };

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

export type FitTableDto = {
  numberOfRows: number;
  numberOfCols: number;
  styles?: FitMapDto<FitStyleDto>;
  rows?: FitMapDto<FitRowDto>;
  cols?: FitMapDto<FitColDto>;
  cells?: FitMatrixDto<FitCellDto>;
  mergedCells?: FitMatrixDto<FitMergedCellDto>;
};

export type FitCellCoordDto = { rowId: number; colId: number };

export type FitCellRangeDto = { from: FitCellCoordDto; to?: FitCellCoordDto };

export type FitLineRangeDto = { from: number; to?: number };
