import { CellRange, Value, LineRange, Style } from 'fit-core/model/index.js';
import { Id } from 'fit-core/operations/index.js';

type RowHeightArgs = Id<'row-height'> & {
  selectedLines: LineRange[];
  dimension?: number;
};

type RowInsertArgs = Id<'row-insert'> & {
  selectedLines: LineRange[];
  numberOfInsertableLines: number;
  canInsertAfter?: boolean;
};

type RowRemoveArgs = Id<'row-remove'> & {
  selectedLines: LineRange[];
};

type ColumnWidthArgs = Id<'column-width'> & {
  selectedLines: LineRange[];
  dimension?: number;
};

type ColumnInsertArgs = Id<'column-insert'> & {
  selectedLines: LineRange[];
  numberOfInsertableLines: number;
  canInsertAfter?: boolean;
};

type ColumnRemoveArgs = Id<'column-remove'> & {
  selectedLines: LineRange[];
};

type CellValueArgs = Id<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
};

type CellRemoveArgs = Id<'cell-remove'> & {
  selectedCells: CellRange[];
};

type CellCutArgs = Id<'cell-cut'> & {
  selectedCells: CellRange[];
};

type CellCopyArgs = Id<'cell-copy'> & {
  selectedCells: CellRange[];
};

type CellPasteArgs = Id<'cell-paste'> & {
  selectedCells: CellRange[];
};

type CellMergeArgs = Id<'cell-merge'> & {
  selectedCells: CellRange[];
};

type CellUnmergeArgs = Id<'cell-unmerge'> & {
  selectedCells: CellRange[];
};

type StyleNameArgs = Id<'style-name'> & {
  selectedCells: CellRange[];
  styleName?: string;
};

type StyleUpdateArgs = Id<'style-update'> & {
  selectedCells: CellRange[];
  style: Style;
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

export type StyleBorderArgs = Id<'style-border'> & {
  selectedCells: CellRange[];
  borderStyle: BorderStyle;
};

export type FitOperationArgs =
  | RowHeightArgs
  | RowInsertArgs
  | RowRemoveArgs
  | ColumnWidthArgs
  | ColumnInsertArgs
  | ColumnRemoveArgs
  | CellValueArgs
  | CellRemoveArgs
  | CellCutArgs
  | CellCopyArgs
  | CellPasteArgs
  | CellMergeArgs
  | CellUnmergeArgs
  | StyleNameArgs
  | StyleUpdateArgs
  | StyleBorderArgs;

export type FitOperationId = FitOperationArgs['id'];
