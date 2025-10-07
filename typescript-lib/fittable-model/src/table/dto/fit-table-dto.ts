import { ObjectListDto, ObjectMapDto, ObjectMatrixDto } from 'fittable-core/common';
import { Value, DataTypeName, Fields } from 'fittable-core/model';

export type FitCellCoordDto = { rowId: number; colId: number };

export type FitCellRangeDto = { from: FitCellCoordDto; to?: FitCellCoordDto };

export type FitLineRangeDto = { from: number; to?: number };

export type FitRowDto = { height?: number, isAutoHeight?: boolean };

export type FitColDto = { width?: number };

export type FitDataTypeDto = { name: DataTypeName, format?: string };

export type FitCellDto = {
  value?: Value;
  dataType?: FitDataTypeDto;
  formattedValue?: string;
  dataRef?: string;
  styleName?: string;
};

export type FitMergedCellDto = { rowSpan?: number; colSpan?: number };

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

export type FitDataDefDto = {
  name: string;
  valueFields: string[];
  keyFields?: string[];
  expandRows?: boolean;
}

export type FitTableDto = {
  numberOfRows: number;
  numberOfCols: number;
  locale?: string;
  styles?: ObjectMapDto<string, FitStyleDto>;
  rows?: ObjectListDto<FitRowDto>;
  cols?: ObjectListDto<FitColDto>;
  cells?: ObjectMatrixDto<FitCellDto>;
  mergedCells?: ObjectMatrixDto<FitMergedCellDto>;
  isDataRefPerspective?: boolean;
  dataDefs?: ObjectMatrixDto<FitDataDefDto>;
};

export type FitDataDto = {
  dataDef: string;
  values: (Value | null)[][];
}

export type FitDataRefDto = {
  dataDef: string,
  valueField: string,
  keyFields: Fields
}