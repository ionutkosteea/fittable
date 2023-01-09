import { LanguageDictionaryFactory } from './model/language-dictionary.js';
import { ImageRegistryFactory } from './model/image-registry.js';
import { CellEditorFactory } from './model/cell-editor.js';
import {
  CellSelectionFactory,
  CellSelectionPainterFactory,
} from './model/cell-selection.js';
import {
  ContextMenuFactory,
  SettingsBarFactory,
  StatusbarFactory,
  ToolbarFactory,
} from './model/controls.js';
import { ViewModelFactory } from './model/view-model.js';
import { CellEditorListenerFactory } from './host-listeners/cell-editor-listener.js';
import { CellSelectionListenerFactory } from './host-listeners/cell-selection-listener.js';
import { WindowListenerFactory } from './host-listeners/window-listener.js';
import { TableScrollerListenerFactory } from './host-listeners/table-scroller-listener.js';
import { HostListenersFactory } from './host-listeners/host-listeners.js';
import { TableScrollerFactory } from './model/table-scroller.js';
import { InputControlListenerFactory } from './host-listeners/input-control-listener.js';
import { CellSelectionScrollerFactory } from './model/cell-selection-scroller.js';
import { TableViewerFactory } from './model/table-viewer.js';
import { ThemeSwitcherFactory } from './model/theme-switcher.js';

export type Option = { label: string; value?: string };

export interface ViewModelConfig {
  rowHeight: number;
  columnWidth: number;
  fontSize: number;
  readOnly?: boolean;
  colorPalette?: Option[];
  fontFamily?: Option[];
  showRowHeader?: boolean;
  showColumnHeader?: boolean;
  rowHeaderColumnWidth?: number;
  columnHeaderRowHeight?: number;
  disableVirtualRows?: boolean;
  disableVirtualColumns?: boolean;
  viewModelFactory: ViewModelFactory;
  languageDictionaryFactory: LanguageDictionaryFactory;
  imageRegistryFactory: ImageRegistryFactory;
  tableScrollerFactory: TableScrollerFactory;
  tableViewerFactory: TableViewerFactory;
  cellSelectionScrollerFactory?: CellSelectionScrollerFactory;
  cellEditorFactory?: CellEditorFactory;
  cellSelectionFactory?: CellSelectionFactory;
  cellSelectionPainterFactory?: CellSelectionPainterFactory;
  themeSwitcherFactory?: ThemeSwitcherFactory;
  contextMenuFactory?: ContextMenuFactory;
  toolbarFactory?: ToolbarFactory;
  settingsBarFactory?: SettingsBarFactory;
  statusbarFactory?: StatusbarFactory;
  hostListenersFactory: HostListenersFactory;
  tableScrollerListenerFactory: TableScrollerListenerFactory;
  cellEditorListenerFactory?: CellEditorListenerFactory;
  cellSelectionListenerFactory?: CellSelectionListenerFactory;
  windowListenerFactory?: WindowListenerFactory;
  inputControlListenerFactory?: InputControlListenerFactory;
}

declare global {
  var fitViewModelConfig: ViewModelConfig | undefined;
}

export function registerViewModelConfig(config: ViewModelConfig): void {
  globalThis.fitViewModelConfig = { ...config };
}

export function unregisterViewModelConfig(): void {
  globalThis.fitViewModelConfig = undefined;
}

export function getViewModelConfig(): ViewModelConfig {
  if (globalThis.fitViewModelConfig) {
    return globalThis.fitViewModelConfig;
  } else {
    throw new Error(
      'The view model configuration has to be registered via the registerViewModelConfig function!'
    );
  }
}
