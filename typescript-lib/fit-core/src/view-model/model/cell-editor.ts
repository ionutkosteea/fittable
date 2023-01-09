import { CellCoord } from '../../model/cell-coord.js';
import { OperationExecutor, Id } from '../../operations/operation-core.js';
import { getViewModelConfig } from '../view-model-config.js';
import { NeighborCells } from './common/neighbor-cells.js';
import { Rectangle } from './common/rectangle.js';
import { FocusableObject, InputControl } from './controls.js';
import { TableViewer } from './table-viewer.js';

export interface CellEditor extends FocusableObject {
  setVisible(visible: boolean): this;
  isVisible(): boolean;
  setCell(cellCoord: CellCoord): this;
  getCell(): CellCoord;
  getCellControl(): InputControl;
  getCellRectangle(): Rectangle | undefined;
  getNeighborCells(): NeighborCells;
  setPointerEvents(events: boolean): this;
  hasPointerEvents(): boolean;
}

export interface CellEditorFactory {
  createCellEditor(
    executor: OperationExecutor<Id<string>, string>,
    tableViewer: TableViewer
  ): CellEditor;
}

export function createCellEditor(
  executor: OperationExecutor<Id<string>, string>,
  tableViewer: TableViewer
): CellEditor {
  const factory: CellEditorFactory | undefined =
    getViewModelConfig().cellEditorFactory;
  if (factory) return factory.createCellEditor(executor, tableViewer);
  else throw new Error('CellEditorFactory is not defined!');
}
