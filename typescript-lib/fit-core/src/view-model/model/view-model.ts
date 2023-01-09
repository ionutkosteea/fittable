import { OperationExecutor, Id } from '../../operations/operation-core.js';

import { LanguageDictionary } from './language-dictionary.js';
import { ImageRegistry } from './image-registry.js';
import { CellSelection, CellSelectionPainter } from './cell-selection.js';
import { CellEditor } from './cell-editor.js';
import { Window, Container, Statusbar } from './controls.js';
import { TableScroller } from './table-scroller.js';
import { getViewModelConfig } from '../view-model-config.js';
import { CellSelectionScroller } from './cell-selection-scroller.js';
import { TableViewer } from './table-viewer.js';
import { Table } from '../../model/table.js';
import { ThemeSwitcher } from './theme-switcher.js';

export interface ViewModel {
  table: Table;
  executor?: OperationExecutor<Id<string>, string>;
  dictionary: LanguageDictionary<string, string>;
  imageRegistry: ImageRegistry<string>;
  tableViewer: TableViewer;
  tableScroller: TableScroller;
  cellSelection?: CellSelection;
  cellSelectionPainter?: CellSelectionPainter;
  cellSelectionScroller?: CellSelectionScroller;
  cellEditor?: CellEditor;
  themeSwitcher?: ThemeSwitcher<string>;
  contextMenu?: Window;
  settingsBar?: Container;
  toolbar?: Container;
  statusbar?: Statusbar;
  destroy(): void;
}

export interface ViewModelFactory {
  createViewModel(table: Table): ViewModel;
}

export function createViewModel<T extends ViewModel>(table: Table): T {
  return getViewModelConfig().viewModelFactory.createViewModel(table) as T;
}
