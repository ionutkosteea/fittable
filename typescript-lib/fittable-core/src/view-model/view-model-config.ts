import { ImageRegistry, ImageRegistryFactory } from './model/image-registry.js';
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

let fitViewModelConfig: ViewModelConfig | undefined;
let imageRegistry: ImageRegistry<string> | undefined;

export function registerViewModelConfig(config: ViewModelConfig): void {
  fitViewModelConfig = { ...config };
  imageRegistry = undefined;
}

export function unregisterViewModelConfig(): void {
  fitViewModelConfig = undefined;
  imageRegistry = undefined;
}

export function getViewModelConfig(): ViewModelConfig {
  if (fitViewModelConfig) {
    return fitViewModelConfig;
  } else {
    throw new Error(
      'The view model configuration has to be registered via the registerViewModelConfig function!'
    );
  }
}

export function getImageRegistry<Id extends string>(): ImageRegistry<Id> {
  if (!imageRegistry) {
    imageRegistry =
      getViewModelConfig().imageRegistryFactory.createImageRegistry();
  }
  return imageRegistry as ImageRegistry<Id>;
}
