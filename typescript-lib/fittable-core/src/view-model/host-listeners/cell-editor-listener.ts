import { Observable } from 'rxjs';

import { MissingFactoryError } from '../../common/factory-error.js';
import { CellRange } from '../../model/table/cell-range.js';
import { CellEditor } from '../model/cell-editor.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitEvent, FitKeyboardEvent, FitMouseEvent } from './html-mockups.js';

export interface CellEditorListener {
  readonly cellEditor: CellEditor;
  onShow(event: FitEvent): void;
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
  createCellEditorListener(
    cellEditor: CellEditor,
    selectedCellsFn: () => CellRange[]
  ): CellEditorListener;
}

export function createCellEditorListener(
  cellEditor: CellEditor,
  selectedCellsFn: () => CellRange[]
): CellEditorListener {
  const factory: CellEditorListenerFactory | undefined =
    getViewModelConfig().cellEditorListenerFactory;
  if (factory) {
    return factory.createCellEditorListener(cellEditor, selectedCellsFn);
  } else {
    throw new MissingFactoryError();
  }
}
