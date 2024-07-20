import { Value, DataTypeName } from 'fittable-core/model';

export type FitMapDto<Val> = { [key: string]: Val };

export type FitRowDto = { height?: number };

export type FitColDto = { width?: number };

export type FitDataTypeDto = { name: DataTypeName, format?: string };

export type FitCellDto = {
  value?: Value;
  dataType?: FitDataTypeDto;
  styleName?: string;
};

export type FitMergedCellDto = { rowSpan?: number; colSpan?: number };

export type FitMatrixDto<Cell> = { [rowId: string]: FitMapDto<Cell> };

export const FIT_STYLE_DTO = {
  'font-weight': '',
  'font-style': '',
  'text-decoration': '',
  'font-family': '',
  'font-size.px': 0,
  color: '',
  'background-color': '',
  'text-align': '',
  'place-items': '',
  'border-left': '',
  'border-right': '',
  'border-top': '',
  'border-bottom': '',
};

export type FitStyleDto = Partial<typeof FIT_STYLE_DTO>;

export type FitTableDto = {
  numberOfRows: number;
  numberOfCols: number;
  locale?: string;
  styles?: FitMapDto<FitStyleDto>;
  rows?: FitMapDto<FitRowDto>;
  cols?: FitMapDto<FitColDto>;
  cells?: FitMatrixDto<FitCellDto>;
  mergedCells?: FitMatrixDto<FitMergedCellDto>;
};

export type FitCellCoordDto = { rowId: number; colId: number };

export type FitCellRangeDto = { from: FitCellCoordDto; to?: FitCellCoordDto };

export type FitLineRangeDto = { from: number; to?: number };
