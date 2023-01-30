import { Observable } from 'rxjs';

import { CellCoord } from '../../model/cell-coord.js';
import { CellRange } from '../../model/cell-range.js';
import { CellEditor } from '../model/cell-editor.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitEvent, FitKeyboardEvent, FitMouseEvent } from './custom-events.js';

export interface CellEditorListener {
  setCellEditor(cellEditor: CellEditor): this;
  getCellEditor(): CellEditor;
  setSelectedCells(selectedCellsFn: () => CellRange[]): this;
  onShow(cellCoord: CellCoord, event?: FitEvent): void;
  onInit(): void;
  onMouseEnter(event?: FitMouseEvent): void;
  onMouseDown(event?: FitMouseEvent): void;
  onGlobalMouseDown(event?: FitMouseEvent): void;
  onGlobalMouseUp(event?: FitMouseEvent): void;
  onKeyDown(event?: FitKeyboardEvent): void;
  onInput(event?: FitEvent): void;
  onContextMenu(event?: FitMouseEvent): void;
  onContextMenu$(): Observable<FitMouseEvent>;
}

export interface CellEditorListenerFactory {
  createCellEditorListener(): CellEditorListener;
}

export function createCellEditorListener(): CellEditorListener {
  const factory: CellEditorListenerFactory | undefined =
    getViewModelConfig().cellEditorListenerFactory;
  if (factory) {
    return factory.createCellEditorListener();
  } else {
    throw new Error('CellEditorListenerFactory is not defined!');
  }
}
