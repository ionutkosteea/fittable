import {
  CellRange,
  Value,
  LineRange,
  Style,
  DataType,
} from 'fittable-core/model';
import { Args } from 'fittable-core/operations';

import { ColFilterArgs } from '../col-filters/col-filter-operation.js';

type RowHeightArgs = Args<'row-height'> & {
  selectedLines: LineRange[];
  height?: number;
  isAuto?: boolean;
};

type RowInsertArgs = Args<'row-insert'> & {
  selectedLines: LineRange[];
  numberOfNewLines: number;
  insertAfter?: boolean;
};

type RowRemoveArgs = Args<'row-remove'> & {
  selectedLines: LineRange[];
};

type ColWidthArgs = Args<'column-width'> & {
  selectedLines: LineRange[];
  width?: number;
};

type ColInsertArgs = Args<'column-insert'> & {
  selectedLines: LineRange[];
  numberOfNewLines: number;
  insertAfter?: boolean;
};

type ColRemoveArgs = Args<'column-remove'> & {
  selectedLines: LineRange[];
};

type CellValueArgs = Args<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
  dataType?: DataType;
};

type CellDataRefArgs = Args<'cell-data-ref'> & {
  selectedCells: CellRange[];
  dataRef?: string;
};

type CellDataTypeArgs = Args<'cell-data-type'> & {
  selectedCells: CellRange[];
  dataType?: DataType;
};

type CellRemoveArgs = Args<'cell-remove'> & {
  selectedCells: CellRange[];
};

type CellCutArgs = Args<'cell-cut'> & {
  selectedCells: CellRange[];
};

type CellCopyArgs = Args<'cell-copy'> & {
  selectedCells: CellRange[];
};

type CellPasteArgs = Args<'cell-paste'> & {
  selectedCells: CellRange[];
};

type CellMergeArgs = Args<'cell-merge'> & {
  selectedCells: CellRange[];
};

type CellUnmergeArgs = Args<'cell-unmerge'> & {
  selectedCells: CellRange[];
};

type PaintFormatArgs = Args<'paint-format'> & {
  selectedCells: CellRange[];
  styleName?: string;
  dataType?: DataType;
};

type StyleUpdateArgs = Args<'style-update'> & {
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

export type StyleBorderArgs = Args<'style-border'> & {
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
  | CellDataRefArgs
  | CellRemoveArgs
  | CellCutArgs
  | CellCopyArgs
  | CellPasteArgs
  | CellMergeArgs
  | CellUnmergeArgs
  | PaintFormatArgs
  | StyleUpdateArgs
  | StyleBorderArgs
  | ColFilterArgs;

export type FitUIOperationId = FitUIOperationArgs['id'] | 'paint-format-copy';
