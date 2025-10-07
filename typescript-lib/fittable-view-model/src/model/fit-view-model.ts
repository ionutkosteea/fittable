import { MissingFactoryError } from 'fittable-core/common';
import {
  asTableDataTypes,
  asTableColFilters,
  CellRange,
  createCellCoord,
  LanguageDictionary,
  Table,
  TableBasics,
  TableDataTypes,
  TableColFilters,
} from 'fittable-core/model';
import { OperationExecutor } from 'fittable-core/operations';
import {
  ViewModel,
  Window,
  Container,
  CellEditor,
  createCellEditor,
  createContextMenu,
  CellSelection,
  createCellSelection,
  createToolbar,
  ViewModelFactory,
  CellSelectionPainter,
  createCellSelectionPainter,
  ScrollContainer,
  createScrollContainer,
  CellSelectionScroller,
  createCellSelectionScroller,
  TableViewer,
  createTableViewer,
  Statusbar,
  createStatusbar,
  ThemeSwitcher,
  createThemeSwitcher,
  createSettingsBar,
  ViewModelConfig,
  getViewModelConfig,
  ColFilters,
  createColFilters,
  MobileLayout,
  createMobileLayout,
  OperationDialog,
  createRowResizeDialog,
  createRowInsertAboveDialog,
  createRowInsertBelowDialog,
  createColResizeDialog,
  createColInsertLeftDialog,
  createColInsertRightDialog
} from 'fittable-core/view-model';

import {
  FIT_CSS_COLOR_VARIABLES,
  setCssVariables,
} from './common/css-variables.js';
import {
  HorizontalScrollbar,
  VerticalScrollbar,
} from './scroll-container/table-scrollbars.js';
import { OperationSubscriptions } from './view-model-subscriptions/operation-subscriptions.js';
import { ViewModelSubscriptions } from './view-model-subscriptions/view-model-subscriptions.js';
import { getLanguageDictionary } from './language/language-def.js';
import { enUS } from './language/en-US.js';
import { deDE } from './language/de-DE.js';

export class FitViewModel implements ViewModel {
  public readonly tableViewer: TableViewer;
  public readonly tableScrollContainer: ScrollContainer;
  public readonly mobileLayout: MobileLayout;
  public readonly cellSelection?: CellSelection;
  public readonly cellSelectionPainter?: CellSelectionPainter;
  public readonly cellSelectionScroller?: CellSelectionScroller;
  public readonly cellEditor?: CellEditor;
  public readonly contextMenu?: Window;
  public readonly toolbar?: Container;
  public readonly statusbar?: Statusbar;
  public readonly themeSwitcher?: ThemeSwitcher;
  public readonly settingsBar?: Container;
  public readonly colFilters?: ColFilters;
  public readonly rowResizeDialog?: OperationDialog;
  public readonly rowInsertAboveDialog?: OperationDialog;
  public readonly rowInsertBelowDialog?: OperationDialog;
  public readonly colResizeDialog?: OperationDialog;
  public readonly colInsertLeftDialog?: OperationDialog;
  public readonly colInsertRightDialog?: OperationDialog;

  private config: ViewModelConfig = getViewModelConfig();
  private viewModelSubscriptions!: ViewModelSubscriptions;
  private operationSubscriptions?: OperationSubscriptions;

  constructor(
    public table: Table,
    public readonly operationExecutor?: OperationExecutor
  ) {
    this.initLocales();
    operationExecutor?.setTable(table);
    this.tableViewer = this.createTableViewer();
    this.tableScrollContainer = this.createTableScrollContainer();
    this.cellSelection = this.createCellSelection();
    this.cellSelectionScroller = this.createCellSelectionScroller();
    this.cellSelectionPainter = this.createCellSelectionPainter();
    this.cellEditor = this.createCellEditor();
    this.selectFirstCell();
    this.rowResizeDialog = this.createRowResizeDialog();
    this.rowInsertAboveDialog = this.createRowInsertAboveDialog();
    this.rowInsertBelowDialog = this.createRowInsertBelowDialog();
    this.colResizeDialog = this.createColResizeDialog();
    this.colInsertLeftDialog = this.createColInsertLeftDialog();
    this.colInsertRightDialog = this.createColInsertRightDialog();
    this.contextMenu = this.createContextMenu();
    this.statusbar = this.createStatusbar();
    this.themeSwitcher = this.createThemeSwitcher();
    this.settingsBar = this.createSettingsBar();
    this.colFilters = this.createColFilters();
    this.mobileLayout = this.createMobileLayout();
    this.toolbar = this.createToolbar();
    this.addSubscriptions();
  }

  private createTableViewer(): TableViewer {
    return createTableViewer(this.table);
  }

  private createTableScrollContainer(): ScrollContainer {
    const tableScrollContainer: ScrollContainer = createScrollContainer(this.tableViewer);
    !this.config.disableVirtualRows &&
      tableScrollContainer.setVerticalScrollbar(new VerticalScrollbar(this.tableViewer));
    !this.config.disableVirtualCols &&
      tableScrollContainer.setHorizontalScrollbar(new HorizontalScrollbar(this.tableViewer));
    return tableScrollContainer;
  }

  private createCellSelectionScroller(): CellSelectionScroller | undefined {
    try {
      return createCellSelectionScroller(
        this.tableViewer,
        this.tableScrollContainer
      );
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createCellEditor(): CellEditor | undefined {
    try {
      return (
        this.operationExecutor &&
        createCellEditor(this.operationExecutor, this.tableViewer)
      );
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createCellSelection(): CellSelection | undefined {
    try {
      return createCellSelection(this.tableViewer);
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createCellSelectionPainter(): CellSelectionPainter | undefined {
    try {
      return (
        this.cellSelection &&
        createCellSelectionPainter({
          tableViewer: this.tableViewer,
          tableScrollContainer: this.tableScrollContainer,
          cellSelection: this.cellSelection,
        })
      );
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createRowResizeDialog(): OperationDialog | undefined {
    try {
      return this.operationExecutor &&
        this.cellSelection &&
        createRowResizeDialog({
          operationExecutor: this.operationExecutor,
          getSelectedCells: this.getSelectedCells
        });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createRowInsertAboveDialog(): OperationDialog | undefined {
    try {
      return this.operationExecutor &&
        this.cellSelection &&
        createRowInsertAboveDialog({
          operationExecutor: this.operationExecutor,
          getSelectedCells: this.getSelectedCells
        });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createRowInsertBelowDialog(): OperationDialog | undefined {
    try {
      return this.operationExecutor &&
        this.cellSelection &&
        createRowInsertBelowDialog({
          operationExecutor: this.operationExecutor,
          getSelectedCells: this.getSelectedCells
        });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createColResizeDialog(): OperationDialog | undefined {
    try {
      return this.operationExecutor &&
        this.cellSelection &&
        createColResizeDialog({
          operationExecutor: this.operationExecutor,
          getSelectedCells: this.getSelectedCells
        });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createColInsertLeftDialog(): OperationDialog | undefined {
    try {
      return this.operationExecutor &&
        this.cellSelection &&
        createColInsertLeftDialog({
          operationExecutor: this.operationExecutor,
          getSelectedCells: this.getSelectedCells
        });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createColInsertRightDialog(): OperationDialog | undefined {
    try {
      return this.operationExecutor &&
        this.cellSelection &&
        createColInsertRightDialog({
          operationExecutor: this.operationExecutor,
          getSelectedCells: this.getSelectedCells
        });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createContextMenu(): Window | undefined {
    try {
      return (
        this.operationExecutor &&
        this.cellSelection &&
        createContextMenu({
          operationExecutor: this.operationExecutor,
          cellEditor: this.cellEditor,
          colFilters: this.colFilters,
          rowResizeDialog: this.rowResizeDialog,
          rowInsertAboveDialog: this.rowInsertAboveDialog,
          rowInsertBelowDialog: this.rowInsertBelowDialog,
          colResizeDialog: this.colResizeDialog,
          colInsertLeftDialog: this.colInsertLeftDialog,
          colInsertRightDialog: this.colInsertRightDialog,
          getSelectedCells: this.getSelectedCells,
        })
      );
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private readonly getSelectedCells = (): CellRange[] =>
    this.cellSelection?.body.getRanges() ?? [];

  private createToolbar(): Container | undefined {
    let toolbar: Container | undefined;
    try {
      toolbar =
        this.operationExecutor &&
        createToolbar({
          operationExecutor: this.operationExecutor,
          cellEditor: this.cellEditor,
          colFilters: this.colFilters,
          getSelectedCells: this.getSelectedCells,
        });
    } catch (error) {
      if (!(error instanceof MissingFactoryError)) console.error(error);
    }
    return toolbar;
  }

  private createStatusbar(): Statusbar | undefined {
    let statusbar: Statusbar | undefined;
    try {
      statusbar = createStatusbar(this.tableViewer, this.tableScrollContainer);
    } catch (error) {
      if (!(error instanceof MissingFactoryError)) console.error(error);
    }
    return statusbar;
  }

  private createThemeSwitcher(): ThemeSwitcher | undefined {
    try {
      return createThemeSwitcher();
    } catch (error) {
      setCssVariables(FIT_CSS_COLOR_VARIABLES);
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createSettingsBar(): Container | undefined {
    try {
      return createSettingsBar(this.themeSwitcher, (locale: string): void => {
        const filterScrTable = this.colFilters?.filterExecutor.table;
        const filterDestTable = this.colFilters?.filterExecutor.getFilteredTable();
        if (filterScrTable && filterDestTable) {
          asTableDataTypes(filterScrTable)?.setLocale(locale);
        } else {
          asTableDataTypes(this.table)?.setLocale(locale);
        }
      });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createColFilters(): ColFilters | undefined {
    try {
      const tableColFilters: (TableBasics & TableColFilters) | undefined =
        asTableColFilters(this.table);
      return (
        tableColFilters &&
        this.operationExecutor &&
        createColFilters(this.operationExecutor)
      );
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createMobileLayout(): MobileLayout {
    return createMobileLayout({
      tableViewer: this.tableViewer,
      tableScrollContainer: this.tableScrollContainer,
      cellSelectionPainter: this.cellSelectionPainter,
    });
  }

  private addSubscriptions(): void {
    this.viewModelSubscriptions = new ViewModelSubscriptions({
      tableScrollContainer: this.tableScrollContainer,
      cellEditor: this.cellEditor,
      cellSelection: this.cellSelection,
      toolbar: this.toolbar,
      contextMenu: this.contextMenu,
      colFilters: this.colFilters,
      settingsBar: this.settingsBar,
    });
    this.viewModelSubscriptions.init();
    if (this.operationExecutor) {
      this.operationSubscriptions = new OperationSubscriptions({
        operationExecutor: this.operationExecutor,
        tableViewer: this.tableViewer,
        tableScrollContainer: this.tableScrollContainer,
        cellEditor: this.cellEditor,
        cellSelection: this.cellSelection,
        cellSelectionPainter: this.cellSelectionPainter,
        colFilters: this.colFilters,
        loadTableFn: this.loadTableWithoutFilters,
        toolbar: this.toolbar,
        contextMenu: this.contextMenu,
      });
      this.operationSubscriptions.init();
    }
  }

  public loadTable(table: Table): void {
    this.operationExecutor?.clearOperations();
    this.loadTableWithoutFilters(table);
    if (this.colFilters) {
      const filterTable: (TableBasics & TableColFilters) | undefined =
        asTableColFilters(table);
      if (filterTable) this.colFilters.filterExecutor.table = filterTable;
    }
  }

  private readonly loadTableWithoutFilters = (table: Table): void => {
    this.table = table;
    this.initLocales();
    this.operationExecutor?.setTable(table);
    this.tableViewer.loadTable(table);
    this.tableScrollContainer.getScroller().scroll(0, 0);
    this.tableScrollContainer.renderModel();
    this.selectFirstCell();
  };

  private initLocales(): void {
    const dictionary: LanguageDictionary<string> =
      getLanguageDictionary().register('en-US', enUS).register('de-DE', deDE);
    const tableDataTypes: TableDataTypes | undefined = asTableDataTypes(this.table);
    if (tableDataTypes) dictionary.setLocale(tableDataTypes.getLocale());
  }

  private selectFirstCell(): void {
    if (this.table.getNumberOfRows() && this.table.getNumberOfCols()) {
      this.cellEditor?.setVisible(true).setCell(createCellCoord(0, 0));
      this.cellSelection?.body
        .removeRanges()
        .createRange()
        .addCell(createCellCoord(0, 0))
        .end();
    } else {
      this.cellEditor?.setVisible(false);
      this.cellSelection?.body.removeRanges().end();
    }
  }

  public destroy(): void {
    this.cellSelection?.destroy();
    this.cellSelectionPainter?.destroy();
    this.colFilters?.destroy();
    this.viewModelSubscriptions.destroy();
    this.operationSubscriptions?.destroy();
    this.mobileLayout.destroy();
    this.statusbar?.destroy();
  }
}

export class FitViewModelFactory implements ViewModelFactory {
  public createViewModel(
    table: Table,
    operationExecutor?: OperationExecutor
  ): FitViewModel {
    return new FitViewModel(table, operationExecutor);
  }
}
