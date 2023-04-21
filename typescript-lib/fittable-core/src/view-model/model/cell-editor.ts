import { Observable } from 'rxjs';

import { MissingFactoryError } from '../../common/factory-error.js';
import { CellCoord } from '../../model/cell-coord.js';
import { OperationExecutor } from '../../operations/operation-core.js';
import { getViewModelConfig } from '../view-model-config.js';
import { NeighborCells } from './common/neighbor-cells.js';
import { Rectangle } from './common/rectangle.js';
import { FocusableObject, InputControl } from './controls.js';
import { TableViewer } from './table-viewer.js';

export interface CellEditor extends FocusableObject {
  isVisible(): boolean;
  setVisible(visible: boolean): this;
  onAfterSetVisible$(): Observable<boolean>;
  getCell(): CellCoord;
  setCell(cellCoord: CellCoord): this;
  onAfterSetCell$(): Observable<CellCoord>;
  hasPointerEvents(): boolean;
  setPointerEvents(events: boolean): this;
  onAfterSetPointerEvents$(): Observable<boolean>;
  getCellControl(): InputControl;
  getCellRectangle(): Rectangle | undefined;
  getNeighborCells(): NeighborCells;
}

export interface CellEditorFactory {
  createCellEditor(
    operationExecutor: OperationExecutor,
    tableViewer: TableViewer
  ): CellEditor;
}

export function createCellEditor(
  operationExecutor: OperationExecutor,
  tableViewer: TableViewer
): CellEditor {
  const factory: CellEditorFactory | undefined =
    getViewModelConfig().cellEditorFactory;
  if (factory) return factory.createCellEditor(operationExecutor, tableViewer);
  else throw new MissingFactoryError();
}
