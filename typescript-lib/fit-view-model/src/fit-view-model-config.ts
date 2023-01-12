import { Option, ViewModelConfig } from 'fit-core/view-model/index.js';

import { COLOR_PALETTE } from './model/common/color-palette.js';
import { FONT_FAMILY } from './model/common/font-family.js';
import { FitTableViewerFactory } from './model/table-viewer/fit-table-viewer.js';
import { FitCellEditorFactory } from './model/cell-editor/fit-cell-editor.js';
import { FitCellSelectionFactory } from './model/cell-selection/fit-cell-selection.js';
import { FitContextMenuFactory } from './model/controls/context-menu/fit-context-menu.js';
import { FitToolbarFactory } from './model/controls/toolbar/fit-toolbar-factory.js';
import { FitViewModelFactory } from './model/fit-view-model.js';
import { FitTableScrollerFactory } from './model/table-scroller/fit-table-scroller.js';
import { FitCellEditorListenerFactory } from './host-listeners/fit-cell-editor-listener.js';
import { FitCellSelectionListenerFactory } from './host-listeners/fit-cell-selection-listener.js';
import { FitTableScrollerListenerFactory } from './host-listeners/fit-table-scroller-listener.js';
import { FitHostListenersFactory } from './host-listeners/fit-host-listeners.js';
import { FitCellSelectionPainterFactory } from './model/cell-selection/fit-cell-selection-painter.js';
import { FitImageRegistryFactory } from './model/image-registry/fit-image-registry.js';
import { FitLanguageDictionaryFactory } from './model/language-dictionary/fit-language-dictionary.js';
import { FitWindowListenerFactory } from './host-listeners/fit-window-listener.js';
import { FitInputControlListenerFactory } from './host-listeners/fit-input-control-listener.js';
import { FitCellSelectionScrollerFactory } from './model/cell-selection/fit-cell-selection-scroller.js';
import { FitStatusbarFactory } from './model/controls/statusbar/fit-statusbar.js';
import { FitThemeSwitcherFactory } from './model/theme-switcher/fit-theme-switcher.js';
import { FitSettingsBarFactory } from './model/controls/settings-bar/fit-settings-bar-factory.js';

export const FIT_VIEW_MODEL_CONFIG: ViewModelConfig = {
  rowHeight: 21,
  columnWidth: 100,
  fontSize: 12,
  colorPalette: COLOR_PALETTE,
  fontFamily: FONT_FAMILY,
  showRowHeader: true,
  showColumnHeader: true,
  rowHeaderColumnWidth: 40,
  columnHeaderRowHeight: 21,
  languageDictionaryFactory: new FitLanguageDictionaryFactory(),
  imageRegistryFactory: new FitImageRegistryFactory(),
  cellEditorFactory: new FitCellEditorFactory(),
  cellSelectionFactory: new FitCellSelectionFactory(),
  cellSelectionPainterFactory: new FitCellSelectionPainterFactory(),
  cellSelectionScrollerFactory: new FitCellSelectionScrollerFactory(),
  contextMenuFactory: new FitContextMenuFactory(),
  toolbarFactory: new FitToolbarFactory(),
  statusbarFactory: new FitStatusbarFactory(),
  tableScrollerFactory: new FitTableScrollerFactory(),
  tableViewerFactory: new FitTableViewerFactory(),
  viewModelFactory: new FitViewModelFactory(),
  themeSwitcherFactory: new FitThemeSwitcherFactory(),
  settingsBarFactory: new FitSettingsBarFactory(),
  cellEditorListenerFactory: new FitCellEditorListenerFactory(),
  cellSelectionListenerFactory: new FitCellSelectionListenerFactory(),
  windowListenerFactory: new FitWindowListenerFactory(),
  tableScrollerListenerFactory: new FitTableScrollerListenerFactory(),
  inputControlListenerFactory: new FitInputControlListenerFactory(),
  hostListenersFactory: new FitHostListenersFactory(),
};

const THIN_VIEW_MODEL_CONFIG: ViewModelConfig = {
  fontSize: FIT_VIEW_MODEL_CONFIG.fontSize,
  rowHeight: FIT_VIEW_MODEL_CONFIG.rowHeight,
  columnWidth: FIT_VIEW_MODEL_CONFIG.columnWidth,
  viewModelFactory: FIT_VIEW_MODEL_CONFIG.viewModelFactory,
  languageDictionaryFactory: FIT_VIEW_MODEL_CONFIG.languageDictionaryFactory,
  imageRegistryFactory: FIT_VIEW_MODEL_CONFIG.imageRegistryFactory,
  tableScrollerFactory: FIT_VIEW_MODEL_CONFIG.tableScrollerFactory,
  tableViewerFactory: FIT_VIEW_MODEL_CONFIG.tableViewerFactory,
  hostListenersFactory: FIT_VIEW_MODEL_CONFIG.hostListenersFactory,
  tableScrollerListenerFactory:
    FIT_VIEW_MODEL_CONFIG.tableScrollerListenerFactory,
};

export type FitViewModelConfigDef = {
  fontSize?: number;
  rowHeight?: number;
  columnWidth?: number;
  colorPalette?: Option[];
  fontFamily?: Option[];
  showRowHeader?: true;
  showColumnHeader?: true;
  rowHeaderColumnWidth?: number;
  columnHeaderRowHeight?: number;
  disableVirtualRows?: boolean;
  disableVirtualColumns?: boolean;
  rowHeader?: boolean;
  columnHeader?: boolean;
  cellEditor?: boolean;
  cellSelection?: boolean;
  contextMenu?: boolean;
  toolbar?: boolean;
  statusbar?: boolean;
  themeSwitcher?: boolean;
  settingsBar?: boolean;
};

export function createFitViewModelConfig(
  configDef: FitViewModelConfigDef,
  srcConfig: ViewModelConfig = THIN_VIEW_MODEL_CONFIG
): ViewModelConfig {
  const config: ViewModelConfig = { ...srcConfig };
  updateUnitConfig(config, configDef);
  updateCellSelectionConfig(config, configDef);
  updateCellEditorConfig(config, configDef);
  updateToolbarConfig(config, configDef);
  updateHeaderConfig(config, configDef);
  updateContextMenuConfig(config, configDef);
  updateStatusbarConfig(config, configDef);
  updateSettingsBarConfig(config, configDef);
  updateListenerConfig(config);
  return config;
}

function updateUnitConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.fontSize) cfg.fontSize = def.fontSize;
  if (def.rowHeight) cfg.rowHeight = def.rowHeight;
  if (def.columnWidth) cfg.columnWidth = def.columnWidth;
  if (def.disableVirtualRows !== undefined) {
    cfg.disableVirtualRows = def.disableVirtualRows;
  }
  if (def.disableVirtualColumns !== undefined) {
    cfg.disableVirtualColumns = def.disableVirtualColumns;
  }
}

function updateCellSelectionConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.cellSelection === undefined) return;
  const srcCfg: ViewModelConfig | undefined = def.cellSelection
    ? FIT_VIEW_MODEL_CONFIG
    : undefined;
  cfg.cellSelectionFactory = srcCfg?.cellSelectionFactory;
  cfg.cellSelectionPainterFactory = srcCfg?.cellSelectionPainterFactory;
  cfg.cellSelectionScrollerFactory = srcCfg?.cellSelectionScrollerFactory;
  cfg.cellSelectionListenerFactory = srcCfg?.cellSelectionListenerFactory;
  if (!cfg.cellSelectionFactory) cfg.contextMenuFactory = undefined;
}

function updateContextMenuConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.contextMenu === undefined) return;
  cfg.contextMenuFactory =
    def.contextMenu && cfg.cellSelectionFactory
      ? FIT_VIEW_MODEL_CONFIG.contextMenuFactory
      : undefined;
}

function updateCellEditorConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.cellEditor === undefined) return;
  const srcCfg: ViewModelConfig | undefined = def.cellEditor
    ? FIT_VIEW_MODEL_CONFIG
    : undefined;
  cfg.cellEditorFactory = srcCfg?.cellEditorFactory;
  cfg.cellEditorListenerFactory = srcCfg?.cellEditorListenerFactory;
}

function updateToolbarConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.toolbar !== undefined) {
    cfg.toolbarFactory = def.toolbar
      ? FIT_VIEW_MODEL_CONFIG.toolbarFactory
      : undefined;
  }
  if (cfg.toolbarFactory) {
    cfg.fontFamily = def.fontFamily ?? FIT_VIEW_MODEL_CONFIG.fontFamily;
    cfg.colorPalette = def.colorPalette ?? FIT_VIEW_MODEL_CONFIG.colorPalette;
  } else {
    cfg.colorPalette = undefined;
    cfg.fontFamily = undefined;
  }
}

function updateHeaderConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.rowHeader !== undefined) {
    cfg.showRowHeader = def.rowHeader;
    cfg.rowHeaderColumnWidth = def.rowHeader
      ? def.rowHeaderColumnWidth ?? FIT_VIEW_MODEL_CONFIG.rowHeaderColumnWidth
      : undefined;
  }
  if (def.columnHeader !== undefined) {
    cfg.showColumnHeader = def.columnHeader;
    cfg.columnHeaderRowHeight = def.columnHeader
      ? def.columnHeaderRowHeight ?? FIT_VIEW_MODEL_CONFIG.columnHeaderRowHeight
      : undefined;
  }
}

function updateStatusbarConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.statusbar === undefined) return;
  cfg.statusbarFactory = def.statusbar
    ? FIT_VIEW_MODEL_CONFIG.statusbarFactory
    : undefined;
}

function updateSettingsBarConfig(
  cfg: ViewModelConfig,
  def: FitViewModelConfigDef
): void {
  if (def.settingsBar !== undefined) {
    if (def.settingsBar) {
      cfg.settingsBarFactory = FIT_VIEW_MODEL_CONFIG.settingsBarFactory;
    } else {
      cfg.settingsBarFactory = undefined;
      cfg.themeSwitcherFactory = undefined;
    }
  }
  if (def.themeSwitcher !== undefined) {
    cfg.themeSwitcherFactory =
      def.themeSwitcher && cfg.settingsBarFactory
        ? FIT_VIEW_MODEL_CONFIG.themeSwitcherFactory
        : undefined;
  }
}

function updateListenerConfig(cfg: ViewModelConfig): void {
  if (cfg.toolbarFactory || cfg.contextMenuFactory || cfg.statusbarFactory) {
    cfg.windowListenerFactory = FIT_VIEW_MODEL_CONFIG.windowListenerFactory;
  }
  if (cfg.toolbarFactory || cfg.contextMenuFactory) {
    cfg.inputControlListenerFactory =
      FIT_VIEW_MODEL_CONFIG.inputControlListenerFactory;
  }
}
