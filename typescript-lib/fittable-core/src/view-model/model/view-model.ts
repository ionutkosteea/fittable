import { OperationExecutor } from '../../operations/operation-core.js';
import { Table } from '../../model/table/table.js';
import { CellSelection, CellSelectionPainter } from './cell-selection.js';
import { CellEditor } from './cell-editor.js';
import { Window, Container } from './controls.js';
import { ScrollContainer } from './scroll-container.js';
import { getViewModelConfig } from '../view-model-config.js';
import { CellSelectionScroller } from './cell-selection-scroller.js';
import { TableViewer } from './table-viewer.js';
import { ThemeSwitcher } from './theme-switcher.js';
import { ColFilters } from './col-filters.js';
import { Statusbar } from './statusbar.js';
import { MobileLayout } from './mobile-layout.js';
import { OperationDialog } from './operation-dialog.js';

export interface ViewModel {
  readonly table: Table;
  readonly operationExecutor?: OperationExecutor;
  tableViewer: TableViewer;
  tableScrollContainer: ScrollContainer;
  mobileLayout: MobileLayout;
  cellSelection?: CellSelection;
  cellSelectionPainter?: CellSelectionPainter;
  cellSelectionScroller?: CellSelectionScroller;
  cellEditor?: CellEditor;
  themeSwitcher?: ThemeSwitcher;
  contextMenu?: Window;
  settingsBar?: Container;
  toolbar?: Container;
  statusbar?: Statusbar;
  colFilters?: ColFilters;
  rowResizeDialog?: OperationDialog;
  rowInsertAboveDialog?: OperationDialog;
  rowInsertBelowDialog?: OperationDialog;
  colResizeDialog?: OperationDialog;
  colInsertLeftDialog?: OperationDialog;
  colInsertRightDialog?: OperationDialog;
  loadTable(table: Table): void;
  destroy(): void;
}

export interface ViewModelFactory {
  createViewModel(
    table: Table,
    operationExecutor?: OperationExecutor
  ): ViewModel;
}

export function createViewModel<T extends ViewModel>(
  table: Table,
  operationExecutor?: OperationExecutor
): T {
  return getViewModelConfig().viewModelFactory.createViewModel(
    table,
    operationExecutor
  ) as T;
}
