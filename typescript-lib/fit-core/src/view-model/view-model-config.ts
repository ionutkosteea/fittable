import { LanguageDictionaryFactory } from './model/language-dictionary.js';
import { ImageRegistryFactory } from './model/image-registry.js';
import { CellEditorFactory } from './model/cell-editor.js';
import {
  CellSelectionFactory,
  CellSelectionPainterFactory,
} from './model/cell-selection.js';
import { ViewModelFactory } from './model/view-model.js';
import { CellEditorListenerFactory } from './host-listeners/cell-editor-listener.js';
import { CellSelectionListenerFactory } from './host-listeners/cell-selection-listener.js';
import { WindowListenerFactory } from './host-listeners/window-listener.js';
import { ScrollContainerListenerFactory } from './host-listeners/scroll-container-listener.js';
import { ScrollContainerFactory } from './model/scroll-container.js';
import { InputControlListenerFactory } from './host-listeners/input-control-listener.js';
import { CellSelectionScrollerFactory } from './model/cell-selection-scroller.js';
import { TableViewerFactory } from './model/table-viewer.js';
import { ThemeSwitcherFactory } from './model/theme-switcher.js';
import { ColFiltersFactory } from './model/col-filters.js';
import { ContextMenuFactory } from './model/context-menu.js';
import { ToolbarFactory } from './model/toolbar.js';
import { SettingsBarFactory } from './model/settings-bar.js';
import { StatusbarFactory } from './model/statusbar.js';
import { MobileLayoutFactory } from './model/mobile-layout.js';

export type Option = { label: string; value?: string };

export interface ViewModelConfig {
  rowHeights: number;
  colWidths: number;
  fontSize: number;
  colorPalette?: Option[];
  fontFamily?: Option[];
  rowHeaderTextFn?: (rowId: number) => string | number;
  colHeaderTextFn?: (colId: number) => string | number;
  rowHeaderWidth?: number;
  colHeaderHeight?: number;
  disableVirtualRows?: boolean;
  disableVirtualCols?: boolean;
  viewModelFactory: ViewModelFactory;
  languageDictionaryFactory: LanguageDictionaryFactory;
  imageRegistryFactory: ImageRegistryFactory;
  scrollContainerFactory: ScrollContainerFactory;
  tableViewerFactory: TableViewerFactory;
  mobileLayoutFactory: MobileLayoutFactory;
  cellSelectionScrollerFactory?: CellSelectionScrollerFactory;
  cellEditorFactory?: CellEditorFactory;
  cellSelectionFactory?: CellSelectionFactory;
  cellSelectionPainterFactory?: CellSelectionPainterFactory;
  themeSwitcherFactory?: ThemeSwitcherFactory;
  contextMenuFactory?: ContextMenuFactory;
  toolbarFactory?: ToolbarFactory;
  settingsBarFactory?: SettingsBarFactory;
  statusbarFactory?: StatusbarFactory;
  colFiltersFactory?: ColFiltersFactory;
  scrollContainerListenerFactory: ScrollContainerListenerFactory;
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
