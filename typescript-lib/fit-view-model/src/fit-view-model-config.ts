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

export const FAT_VIEW_MODEL_CONFIG: ViewModelConfig = {
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

export const THIN_VIEWMODEL_CONFIG: ViewModelConfig = {
  fontSize: FAT_VIEW_MODEL_CONFIG.fontSize,
  rowHeight: FAT_VIEW_MODEL_CONFIG.rowHeight,
  columnWidth: FAT_VIEW_MODEL_CONFIG.columnWidth,
  viewModelFactory: FAT_VIEW_MODEL_CONFIG.viewModelFactory,
  languageDictionaryFactory: FAT_VIEW_MODEL_CONFIG.languageDictionaryFactory,
  imageRegistryFactory: FAT_VIEW_MODEL_CONFIG.imageRegistryFactory,
  tableScrollerFactory: FAT_VIEW_MODEL_CONFIG.tableScrollerFactory,
  tableViewerFactory: FAT_VIEW_MODEL_CONFIG.tableViewerFactory,
  hostListenersFactory: FAT_VIEW_MODEL_CONFIG.hostListenersFactory,
  tableScrollerListenerFactory:
    FAT_VIEW_MODEL_CONFIG.tableScrollerListenerFactory,
};

export class ViewModelConfigBuilder {
  constructor(
    private readonly cfg: ViewModelConfig = { ...THIN_VIEWMODEL_CONFIG }
  ) {}

  public setReadOnly(enable: boolean): this {
    this.cfg.readOnly = enable;
    return this;
  }

  public setCellEditor(enable: boolean): this {
    if (enable) {
      const df: ViewModelConfig = FAT_VIEW_MODEL_CONFIG;
      this.cfg.cellEditorFactory = df.cellEditorFactory;
      this.cfg.cellEditorListenerFactory = df.cellEditorListenerFactory;
    } else {
      this.cfg.cellEditorFactory = undefined;
      this.cfg.cellEditorListenerFactory = undefined;
    }
    return this;
  }

  public setThemeSwitcher(enable: boolean): this {
    this.cfg.themeSwitcherFactory = enable
      ? FAT_VIEW_MODEL_CONFIG.themeSwitcherFactory
      : undefined;
    return this;
  }

  public setSettingsBar(enable: boolean): this {
    this.cfg.settingsBarFactory = enable
      ? (this.cfg.settingsBarFactory = FAT_VIEW_MODEL_CONFIG.settingsBarFactory)
      : undefined;
    return this;
  }

  public setStatusbar(enable: boolean): this {
    this.cfg.statusbarFactory = enable
      ? FAT_VIEW_MODEL_CONFIG.statusbarFactory
      : undefined;
    return this;
  }

  public setCellSelection(enable: boolean): this {
    if (enable) {
      const df: ViewModelConfig = FAT_VIEW_MODEL_CONFIG;
      this.cfg.cellSelectionFactory = df.cellSelectionFactory;
      this.cfg.cellSelectionPainterFactory = df.cellSelectionPainterFactory;
      this.cfg.cellSelectionScrollerFactory = df.cellSelectionScrollerFactory;
      this.cfg.cellSelectionListenerFactory = df.cellSelectionListenerFactory;
    } else {
      this.cfg.cellSelectionFactory = undefined;
      this.cfg.cellSelectionPainterFactory = undefined;
      this.cfg.cellSelectionScrollerFactory = undefined;
      this.cfg.cellSelectionListenerFactory = undefined;
    }
    return this;
  }

  public setContextMenu(enable: boolean): this {
    this.cfg.contextMenuFactory = enable
      ? FAT_VIEW_MODEL_CONFIG.contextMenuFactory
      : undefined;
    return this;
  }

  public setToolbar(enable: boolean): this {
    this.cfg.toolbarFactory = enable
      ? (this.cfg.toolbarFactory = FAT_VIEW_MODEL_CONFIG.toolbarFactory)
      : undefined;
    return this;
  }

  public setRowHeader(enable: boolean): this {
    this.cfg.showRowHeader = enable;
    return this;
  }

  public setColumnHeader(enable: boolean): this {
    this.cfg.showColumnHeader = enable;
    return this;
  }

  public setRowHeaderColumnWidth(width?: number): this {
    this.cfg.rowHeaderColumnWidth = width;
    return this;
  }

  public setColumnHeaderRowHeight(height?: number): this {
    this.cfg.columnHeaderRowHeight = height;
    return this;
  }

  public setColorPalette(palette?: Option[]): this {
    this.cfg.colorPalette = palette;
    return this;
  }

  public setFontFamily(fonts?: Option[]): this {
    this.cfg.fontFamily = fonts;
    return this;
  }

  public setFontSize(size: number): this {
    this.cfg.fontSize = size;
    return this;
  }

  public setRowHeight(height: number): this {
    this.cfg.rowHeight = height;
    return this;
  }

  public setColumnWidth(width: number): this {
    this.cfg.columnWidth = width;
    return this;
  }

  public setDisableVirtualRows(disable: boolean): this {
    this.cfg.disableVirtualRows = disable;
    return this;
  }

  public setDisableVirtualColumns(disable: boolean): this {
    this.cfg.disableVirtualColumns = disable;
    return this;
  }

  public build(): ViewModelConfig {
    this.adjustCfg();
    return this.cfg;
  }

  private adjustCfg(): void {
    if (this.cfg.readOnly) {
      this.setCellEditor(false);
      this.setToolbar(false);
      this.setContextMenu(false);
    }

    if (!this.cfg.cellSelectionFactory) {
      this.cfg.contextMenuFactory && this.setContextMenu(false);
      if (!this.cfg.cellEditorFactory) {
        this.cfg.toolbarFactory && this.setToolbar(false);
      }
    }

    if (!this.cfg.settingsBarFactory) {
      this.cfg.themeSwitcherFactory && this.setThemeSwitcher(false);
    }

    this.cfg.windowListenerFactory =
      this.cfg.toolbarFactory ||
      this.cfg.contextMenuFactory ||
      this.cfg.settingsBarFactory
        ? FAT_VIEW_MODEL_CONFIG.windowListenerFactory
        : undefined;

    this.cfg.inputControlListenerFactory =
      this.cfg.toolbarFactory || this.cfg.contextMenuFactory
        ? FAT_VIEW_MODEL_CONFIG.inputControlListenerFactory
        : undefined;

    if (this.cfg.toolbarFactory) {
      !this.cfg.fontFamily &&
        this.setFontFamily(FAT_VIEW_MODEL_CONFIG.fontFamily);
      !this.cfg.colorPalette &&
        this.setColorPalette(FAT_VIEW_MODEL_CONFIG.colorPalette);
    } else {
      this.cfg.fontFamily && this.setFontFamily();
      this.cfg.colorPalette && this.setColorPalette();
    }

    if (this.cfg.showRowHeader) {
      !this.cfg.rowHeaderColumnWidth &&
        this.setRowHeaderColumnWidth(
          FAT_VIEW_MODEL_CONFIG.rowHeaderColumnWidth
        );
    } else {
      this.cfg.rowHeaderColumnWidth && this.setRowHeaderColumnWidth();
    }

    if (this.cfg.showColumnHeader) {
      !this.cfg.columnHeaderRowHeight &&
        this.setColumnHeaderRowHeight(
          FAT_VIEW_MODEL_CONFIG.columnHeaderRowHeight
        );
    } else {
      this.cfg.columnHeaderRowHeight && this.setColumnHeaderRowHeight();
    }
  }
}
