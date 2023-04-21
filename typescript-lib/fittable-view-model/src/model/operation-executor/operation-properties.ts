export type FitUIOperationFocus =
  | 'Body'
  | 'RowHeader'
  | 'ColHeader'
  | 'PageHeader'
  | 'CellEditor'
  | 'ColFilter';

export type FitUIOperationScroll = { left: number; top: number };

export type FitUIOperationProperties = {
  focus?: FitUIOperationFocus;
  preventFocus?: boolean;
  bodyCellRanges?: unknown[];
  cellEditorCoord?: unknown;
  cellEditorVisibility?: boolean;
  scroll?: FitUIOperationScroll;
};
