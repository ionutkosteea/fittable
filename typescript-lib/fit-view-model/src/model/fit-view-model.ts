import { CellRange, createCellCoord, Table } from 'fit-core/model/index.js';
import { OperationExecutor } from 'fit-core/operations/index.js';
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
  TableScroller,
  createTableScroller,
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
} from 'fit-core/view-model/index.js';

import {
  FIT_CSS_COLOR_VARIABLES,
  FIT_CSS_UNIT_VARIABLES,
  setCssVariable,
  setCssVariables,
} from './common/css-variables.js';
import { OperationSubscriptions } from './view-model-subscriptions/operation-subscriptions.js';
import { ViewModelSubscriptions } from './view-model-subscriptions/view-model-subscriptions.js';

export class FitViewModel implements ViewModel {
  public readonly dictionary: LanguageDictionary;
  public readonly imageRegistry: ImageRegistry;
  public readonly tableViewer: TableViewer;
  public readonly tableScroller: TableScroller;
  public readonly cellSelection?: CellSelection;
  public readonly cellSelectionPainter?: CellSelectionPainter;
  public readonly cellSelectionScroller?: CellSelectionScroller;
  public readonly cellEditor?: CellEditor;
  public readonly contextMenu?: Window;
  public readonly toolbar?: Container;
  public readonly statusbar?: Statusbar;
  public readonly themeSwitcher?: ThemeSwitcher;
  public readonly settingsBar?: Container;

  private config: ViewModelConfig = getViewModelConfig();
  private viewModelSubscriptions!: ViewModelSubscriptions;
  private operationSubscriptions?: OperationSubscriptions;

  constructor(
    public table: Table,
    public readonly operationExecutor?: OperationExecutor
  ) {
    this.loadTable(table);
    this.dictionary = createLanguageDictionary();
    this.imageRegistry = createImageRegistry();
    this.tableViewer = this.createTableViewer();
    this.tableScroller = this.createTableScroller();
    this.cellSelection = this.createCellSelection();
    this.cellSelectionScroller = this.createCellSelectionScroller();
    this.cellSelectionPainter = this.createCellSelectionPainter();
    this.selectFirstCell();
    this.cellEditor = this.createCellEditor();
    this.contextMenu = this.createContextMenu();
    this.toolbar = this.createToolbar();
    this.statusbar = this.createStatusbar();
    this.themeSwitcher = this.createThemeSwitcher();
    this.settingsBar = this.createSettingsBar();

    this.addSubscriptions();
  }

  private createTableViewer(): TableViewer {
    return createTableViewer(this.table);
  }

  private createTableScroller(): TableScroller {
    const tableScroller: TableScroller = createTableScroller(this.tableViewer);
    this.config.disableVirtualRows && tableScroller.setVerticalScrollbar();
    this.config.disableVirtualColumns && tableScroller.setHorizontalScrollbar();
    return tableScroller;
  }

  private createCellSelectionScroller(): CellSelectionScroller | undefined {
    try {
      return createCellSelectionScroller(this.tableViewer, this.tableScroller);
    } catch {
      return undefined;
    }
  }

  private createCellEditor(): CellEditor | undefined {
    try {
      return (
        this.operationExecutor &&
        createCellEditor(this.operationExecutor, this.tableViewer)
      );
    } catch {
      return undefined;
    }
  }

  private createCellSelection(): CellSelection | undefined {
    try {
      return createCellSelection(this.tableViewer);
    } catch {
      return undefined;
    }
  }

  private createCellSelectionPainter(): CellSelectionPainter | undefined {
    try {
      return (
        this.cellSelection &&
        createCellSelectionPainter(this.tableViewer, this.cellSelection)
      );
    } catch {
      return undefined;
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
    } catch {
      return undefined;
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
    } catch {}
    if (toolbar) {
      const defaultHeight: string = FIT_CSS_UNIT_VARIABLES['--toolbar-height'];
      setCssVariable('--toolbar-height', defaultHeight);
    } else {
      setCssVariable('--toolbar-height', '0px');
    }
    setCssVariable('--font-size', (getViewModelConfig().fontSize ?? 0) + 'px');
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
    } catch {}
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
    } catch {
      setCssVariables(FIT_CSS_COLOR_VARIABLES);
      return undefined;
    }
  }

  private createSettingsBar(): Container | undefined {
    try {
      return createSettingsBar({
        dictionary: this.dictionary,
        imageRegistry: this.imageRegistry,
        themeSwitcher: this.themeSwitcher,
      });
    } catch {
      return undefined;
    }
  }

  private selectFirstCell(): void {
    this.cellSelection?.body.createRange().addCell(createCellCoord(0, 0));
  }

  private addSubscriptions(): void {
    this.viewModelSubscriptions = new ViewModelSubscriptions(this);
    this.viewModelSubscriptions.init();
    if (this.operationExecutor) {
      this.operationSubscriptions = new OperationSubscriptions({
        operationExecutor: this.operationExecutor,
        tableViewer: this.tableViewer,
        tableScroller: this.tableScroller,
        cellEditor: this.cellEditor,
        cellSelection: this.cellSelection,
        cellSelectionPainter: this.cellSelectionPainter,
      });
      this.operationSubscriptions.init();
    }
  }

  public loadTable(table: Table): void {
    this.operationExecutor?.setTable(table);
    this.tableViewer?.setTable(table);
    this.tableScroller
      ?.resizeViewportWidth()
      .resizeViewportHeight()
      .renderTable();
    this.table = table;
    this.cellEditor?.setCell(this.cellEditor.getCell());
  }

  public destroy(): void {
    this.cellSelection?.destroy();
    this.cellSelectionPainter?.destroy();
    this.viewModelSubscriptions.destroy();
    this.operationSubscriptions?.destroy();
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
