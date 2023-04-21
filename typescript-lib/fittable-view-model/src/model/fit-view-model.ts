import { MissingFactoryError } from 'fittable-core/common/index.js';
import {
  asTableColFilter,
  CellRange,
  createCellCoord,
  Table,
  TableBasics,
  TableColFilter,
} from 'fittable-core/model/index.js';
import { OperationExecutor } from 'fittable-core/operations/index.js';
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
  createImageRegistry,
  createLanguageDictionary,
  ImageRegistry,
  LanguageDictionary,
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
} from 'fittable-core/view-model/index.js';

import {
  FIT_CSS_COLOR_VARIABLES,
  FIT_CSS_UNIT_VARIABLES,
  setCssVariable,
  setCssVariables,
} from './common/css-variables.js';
import {
  HorizontalScrollbar,
  VerticalScrollbar,
} from './scroll-container/table-scrollbars.js';
import { OperationSubscriptions } from './view-model-subscriptions/operation-subscriptions.js';
import { ViewModelSubscriptions } from './view-model-subscriptions/view-model-subscriptions.js';

export class FitViewModel implements ViewModel {
  public readonly dictionary: LanguageDictionary;
  public readonly imageRegistry: ImageRegistry;
  public readonly tableViewer: TableViewer;
  public readonly tableScroller: ScrollContainer;
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

  private config: ViewModelConfig = getViewModelConfig();
  private viewModelSubscriptions!: ViewModelSubscriptions;
  private operationSubscriptions?: OperationSubscriptions;

  constructor(
    public table: Table,
    public readonly operationExecutor?: OperationExecutor
  ) {
    operationExecutor?.setTable(table);
    this.dictionary = createLanguageDictionary();
    this.imageRegistry = createImageRegistry();
    this.tableViewer = this.createTableViewer();
    this.tableScroller = this.createTableScroller();
    this.cellSelection = this.createCellSelection();
    this.cellSelectionScroller = this.createCellSelectionScroller();
    this.cellSelectionPainter = this.createCellSelectionPainter();
    this.cellEditor = this.createCellEditor();
    this.contextMenu = this.createContextMenu();
    this.statusbar = this.createStatusbar();
    this.themeSwitcher = this.createThemeSwitcher();
    this.settingsBar = this.createSettingsBar();
    this.colFilters = this.createColFilters();
    this.mobileLayout = this.createMobileLayout();
    this.selectFirstCell();
    this.toolbar = this.createToolbar();
    this.addSubscriptions();
  }

  private createTableViewer(): TableViewer {
    return createTableViewer(this.table);
  }

  private createTableScroller(): ScrollContainer {
    const tableScroller: ScrollContainer = //
      createScrollContainer(this.tableViewer)
        .setHorizontalScrollbar(new HorizontalScrollbar(this.tableViewer))
        .setVerticalScrollbar(new VerticalScrollbar(this.tableViewer));
    this.config.disableVirtualRows && tableScroller.setVerticalScrollbar();
    this.config.disableVirtualCols && tableScroller.setHorizontalScrollbar();
    return tableScroller;
  }

  private createCellSelectionScroller(): CellSelectionScroller | undefined {
    try {
      return createCellSelectionScroller(this.tableViewer, this.tableScroller);
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
          tableScroller: this.tableScroller,
          cellSelection: this.cellSelection,
        })
      );
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
          dictionary: this.dictionary,
          imageRegistry: this.imageRegistry,
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
          dictionary: this.dictionary,
          imageRegistry: this.imageRegistry,
          getSelectedCells: this.getSelectedCells,
        });
    } catch (error) {
      if (!(error instanceof MissingFactoryError)) console.error(error);
    }
    if (toolbar) {
      const defaultHeight: string = FIT_CSS_UNIT_VARIABLES['--toolbar-height'];
      setCssVariable('--toolbar-height', defaultHeight);
    } else {
      setCssVariable('--toolbar-height', '0px');
    }
    const config: ViewModelConfig = getViewModelConfig();
    setCssVariable('--font-size', config.fontSize + 'px');
    if (config.fontFamily) {
      setCssVariable('--font-family', config.fontFamily[0]?.value ?? '');
    }
    return toolbar;
  }

  private createStatusbar(): Statusbar | undefined {
    let statusbar: Statusbar | undefined;
    try {
      statusbar = createStatusbar({
        dictionary: this.dictionary,
        tableViewer: this.tableViewer,
        tableScroller: this.tableScroller,
      });
    } catch (error) {
      if (!(error instanceof MissingFactoryError)) console.error(error);
    }
    if (statusbar) {
      const defaultHeight: string =
        FIT_CSS_UNIT_VARIABLES['--statusbar-height'];
      setCssVariable('--statusbar-height', defaultHeight);
    } else {
      setCssVariable('--statusbar-height', '0px');
    }
    return statusbar;
  }

  private createThemeSwitcher(): ThemeSwitcher | undefined {
    try {
      return createThemeSwitcher(this.imageRegistry);
    } catch (error) {
      setCssVariables(FIT_CSS_COLOR_VARIABLES);
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createSettingsBar(): Container | undefined {
    try {
      return createSettingsBar({
        dictionary: this.dictionary,
        imageRegistry: this.imageRegistry,
        themeSwitcher: this.themeSwitcher,
      });
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createColFilters(): ColFilters | undefined {
    try {
      const filterTable: (TableBasics & TableColFilter) | undefined =
        asTableColFilter(this.table);
      return (
        filterTable &&
        this.operationExecutor &&
        createColFilters({
          dictionary: this.dictionary,
          imageRegistry: this.imageRegistry,
          operationExecutor: this.operationExecutor,
        })
      );
    } catch (error) {
      if (error instanceof MissingFactoryError) return undefined;
      else console.error(error);
    }
  }

  private createMobileLayout(): MobileLayout {
    return createMobileLayout({
      tableViewer: this.tableViewer,
      tableScroller: this.tableScroller,
      cellSelectionPainter: this.cellSelectionPainter,
    });
  }

  private addSubscriptions(): void {
    this.viewModelSubscriptions = new ViewModelSubscriptions({
      tableScroller: this.tableScroller,
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
        tableScroller: this.tableScroller,
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
      const filterTable: (TableBasics & TableColFilter) | undefined =
        asTableColFilter(table);
      if (filterTable) this.colFilters.filterExecutor.table = filterTable;
    }
  }

  private readonly loadTableWithoutFilters = (table: Table): void => {
    this.table = table;
    this.operationExecutor?.setTable(table);
    this.tableViewer.loadTable(table);
    this.tableScroller.scrollTo(0, 0);
    this.tableScroller
      .resizeViewportWidth()
      .resizeViewportHeight()
      .renderModel();
    this.selectFirstCell();
  };

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
