import { CellCoord } from '../../model/cell-coord.js';
import { getViewModelConfig } from '../view-model-config.js';
import { CellSelection, CellSelectionRanges } from '../model/cell-selection.js';
import { CellSelectionScroller } from '../model/cell-selection-scroller.js';
import { FitKeyboardEvent, FitMouseEvent } from './custom-events.js';

export interface CellSelectionListener {
  setCellSelectionRanges(ranges: CellSelectionRanges): this;
  onMouseDown(cellCoord: CellCoord, event?: FitMouseEvent): void;
  onMouseMove(cellCoord: CellCoord, event?: FitMouseEvent): void;
  onGlobalMouseUp(event?: FitMouseEvent): void;
  onGlobalKeyDown(event?: FitKeyboardEvent): void;
  onGlobalKeyUp(event?: FitKeyboardEvent): void;
}

export interface CellSelectionListenerFactory {
  createCellSelectionListener(
    cellSelection: CellSelection,
    cellSelectionScroller?: CellSelectionScroller
  ): CellSelectionListener;
}

export function createCellSelectionListener(
  cellSelection: CellSelection,
  cellSelectionScroller?: CellSelectionScroller
): CellSelectionListener {
  const factory: CellSelectionListenerFactory | undefined =
    getViewModelConfig().cellSelectionListenerFactory;
  if (factory) {
    return factory.createCellSelectionListener(
      cellSelection,
      cellSelectionScroller
    );
  } else {
    throw new Error('CellSelectionListenerFactory is not defined!');
  }
}
