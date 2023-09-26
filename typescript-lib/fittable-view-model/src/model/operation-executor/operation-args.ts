import {
  CellRange,
  Value,
  LineRange,
  Style,
  DataType,
} from 'fittable-core/model';
import { OperationId } from 'fittable-core/operations';

import { ColFilterOperationArgs } from '../col-filters/col-filter-operation.js';

type RowHeightArgs = OperationId<'row-height'> & {
  selectedLines: LineRange[];
  dimension?: number;
};

type RowInsertArgs = OperationId<'row-insert'> & {
  selectedLines: LineRange[];
  numberOfNewLines: number;
  insertAfter?: boolean;
};

type RowRemoveArgs = OperationId<'row-remove'> & {
  selectedLines: LineRange[];
};

type ColWidthArgs = OperationId<'column-width'> & {
  selectedLines: LineRange[];
  dimension?: number;
};

type ColInsertArgs = OperationId<'column-insert'> & {
  selectedLines: LineRange[];
  numberOfNewLines: number;
  insertAfter?: boolean;
};

type ColRemoveArgs = OperationId<'column-remove'> & {
  selectedLines: LineRange[];
};

type CellValueArgs = OperationId<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
  dataType?: DataType;
};

type CellDataTypeArgs = OperationId<'cell-data-type'> & {
  selectedCells: CellRange[];
  dataType?: DataType;
};

type CellRemoveArgs = OperationId<'cell-remove'> & {
  selectedCells: CellRange[];
};

type CellCutArgs = OperationId<'cell-cut'> & {
  selectedCells: CellRange[];
};

type CellCopyArgs = OperationId<'cell-copy'> & {
  selectedCells: CellRange[];
};

type CellPasteArgs = OperationId<'cell-paste'> & {
  selectedCells: CellRange[];
};

type CellMergeArgs = OperationId<'cell-merge'> & {
  selectedCells: CellRange[];
};

type CellUnmergeArgs = OperationId<'cell-unmerge'> & {
  selectedCells: CellRange[];
};

type PaintFormatArgs = OperationId<'paint-format'> & {
  selectedCells: CellRange[];
  styleName?: string;
  dataType?: DataType;
};

type StyleUpdateArgs = OperationId<'style-update'> & {
  selectedCells: CellRange[];
  styleSnippet: Style;
};

export type BorderLocation =
  | 'none'
  | 'all'
  | 'around'
  | 'cross'
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type BorderType = 'solid' | 'dotted' | 'dashed';

export type BorderStyle = {
  location: BorderLocation;
  thickness: number;
  type: BorderType;
  color: string;
};

export type StyleBorderArgs = OperationId<'style-border'> & {
  selectedCells: CellRange[];
  borderStyle: BorderStyle;
};

export type FitUIOperationArgs =
  | RowHeightArgs
  | RowInsertArgs
  | RowRemoveArgs
  | ColWidthArgs
  | ColInsertArgs
  | ColRemoveArgs
  | CellValueArgs
  | CellDataTypeArgs
  | CellRemoveArgs
  | CellCutArgs
  | CellCopyArgs
  | CellPasteArgs
  | CellMergeArgs
  | CellUnmergeArgs
  | PaintFormatArgs
  | StyleUpdateArgs
  | StyleBorderArgs
  | ColFilterOperationArgs;

export type FitUIOperationId = FitUIOperationArgs['id'] | 'paint-format-copy';
