import { Observable, Subscription } from 'rxjs';

import {
  CellRange,
  CellCoord,
  createCellCoord,
  Table,
  createCellRange,
  createCellRangeList4Dto,
  createCellCoord4Dto,
  createDto4CellRangeList,
} from 'fittable-core/model';
import { OperationDto, OperationExecutor } from 'fittable-core/operations';
import {
  ScrollContainer,
  CellEditor,
  CellSelection,
  CellSelectionPainter,
  TableViewer,
  ColFilters,
  Container,
  Window,
  FocusableObject,
  CellSelectionRanges,
} from 'fittable-core/view-model';

import { FitUIOperationId } from '../operation-executor/operation-args.js';
import { ColFilterOperationSubscriptions } from '../col-filters/col-filter-operation-subscriptions.js';
import {
  FitUIOperationFocus,
  FitUIOperationProperties,
  FitUIOperationScroll,
} from '../operation-executor/operation-properties.js';

type LastLines = {
  lastRow: number;
  lastCol: number;
  lastSelectedRow: number;
  lastSelectedCol: number;
};
export type OperationSubscriptionArgs = {
  operationExecutor: OperationExecutor;
  tableScroller: ScrollContainer;
  tableViewer: TableViewer;
  cellEditor?: CellEditor;
  cellSelection?: CellSelection;
  cellSelectionPainter?: CellSelectionPainter;
  toolbar?: Container;
  contextMenu?: Window;
  colFilters?: ColFilters;
  loadTableFn?: (table: Table) => void;
};

export class OperationSubscriptions {
  private selectedBodyCells: CellRange[] = [
    createCellRange(createCellCoord(0, 0)),
  ];
  private currentFocus?: FitUIOperationFocus = 'Body';
  private filterSubscriptions?: ColFilterOperationSubscriptions;
  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  constructor(private args: OperationSubscriptionArgs) {}

  public init(): void {
    this.setSelectedBodyCells();
    this.setCurrentFocus();
    this.createUpdateSubscriptions();
    this.createRefreshSubscriptions();
    this.createFilterSubscriptions();
  }

  private setSelectedBodyCells(): void {
    this.subscriptions.add(
      this.args.cellSelection?.body
        .onEnd$()
        .subscribe((cellRanges: CellRange[]): void => {
          this.selectedBodyCells = cellRanges;
        })
    );
  }

  private setCurrentFocus(): void {
    this.setObjectFocus(this.args.cellSelection?.body, 'Body');
    this.setObjectFocus(this.args.cellSelection?.rowHeader, 'RowHeader');
    this.setObjectFocus(this.args.cellSelection?.colHeader, 'ColHeader');
    this.setObjectFocus(this.args.cellSelection?.pageHeader, 'PageHeader');
    this.setObjectFocus(this.args.cellEditor, 'CellEditor');
    this.setObjectFocus(
      this.args.colFilters?.getPopupButton(0).getWindow(),
      'ColFilter'
    );
  }

  private setObjectFocus(
    object?: FocusableObject,
    focus?: FitUIOperationFocus
  ): void {
    this.subscriptions.add(
      object?.onAfterSetFocus$().subscribe((isFocused: boolean): void => {
        if (isFocused) this.currentFocus = focus;
      })
    );
  }

  private createUpdateSubscriptions(): void {
    this.afterUpdate();
    this.afterUndoRedo(this.args.operationExecutor.onAfterUndo$());
    this.afterUndoRedo(this.args.operationExecutor.onAfterRedo$());
  }

  private afterUpdate(): void {
    this.subscriptions.add(
      this.args.operationExecutor
        .onAfterRun$()
        .subscribe((operationDto: OperationDto): void => {
          if (!operationDto.properties) operationDto.properties = {};
          this.markCurrentFocus(operationDto);
          this.markSelectedCells(operationDto);
          this.markCellEditorVisibility(operationDto);
          this.markCellEditorCoord(operationDto);
          this.markScrollPosition(operationDto);
        })
    );
  }

  private markCurrentFocus(operationDto: OperationDto): void {
    const properties: FitUIOperationProperties =
      this.getOperationProperties(operationDto);
    if (properties.focus) return;
    properties.focus = this.currentFocus;
  }

  private markSelectedCells(operationDto: OperationDto): void {
    if (!this.args.cellSelection) return;
    const properties: FitUIOperationProperties =
      this.getOperationProperties(operationDto);
    if (properties.bodyCellRanges) {
      this.setSelectedCells(operationDto);
    } else {
      const operationId: FitUIOperationId = operationDto.id as FitUIOperationId;
      if (operationId === 'style-name') {
        properties.bodyCellRanges = //
          createDto4CellRangeList(this.args.cellSelection.body.getRanges());
      } else {
        properties.bodyCellRanges = //
          createDto4CellRangeList(this.selectedBodyCells);
      }
    }
  }

  private markCellEditorVisibility(operationDto: OperationDto): void {
    if (!this.args.cellEditor) return;
    const properties: FitUIOperationProperties =
      this.getOperationProperties(operationDto);
    if (properties.cellEditorVisibility === undefined) {
      const isVisible: boolean = this.args.cellEditor.isVisible();
      properties.cellEditorVisibility = isVisible;
    } else {
      this.setCellEditorVisibility(operationDto);
    }
  }

  private markCellEditorCoord(operationDto: OperationDto): void {
    if (!this.args.cellEditor) return;
    const properties: FitUIOperationProperties =
      this.getOperationProperties(operationDto);
    if (properties.cellEditorCoord) {
      this.setCellEditorCoord(operationDto);
    } else {
      const cellCoord: CellCoord = this.args.cellEditor.getCell();
      properties.cellEditorCoord = cellCoord.getDto();
    }
  }

  private markScrollPosition(operationDto: OperationDto): void {
    const properties: FitUIOperationProperties =
      this.getOperationProperties(operationDto);
    if (properties.scroll) {
      this.setScrollPosition(operationDto);
    } else {
      const top: number = this.args.tableScroller.getTop();
      const left: number = this.args.tableScroller.getLeft();
      if (properties) properties.scroll = { left, top };
    }
  }

  private afterUndoRedo(operation$: Observable<OperationDto>): void {
    this.subscriptions.add(
      operation$.subscribe((operationDto: OperationDto): void => {
        this.setSelectedCells(operationDto);
        this.setCellEditorVisibility(operationDto);
        this.setCellEditorCoord(operationDto);
        this.setScrollPosition(operationDto);
      })
    );
  }

  private setSelectedCells(operationDto: OperationDto): void {
    if (!this.args.cellSelection) return;
    const properties: FitUIOperationProperties | undefined =
      this.getOperationProperties(operationDto);
    if (!properties) return;
    const selectedCellsDto: unknown[] | undefined = properties.bodyCellRanges;
    const selectedCells: CellRange[] | undefined =
      selectedCellsDto && createCellRangeList4Dto(selectedCellsDto);
    if (!selectedCells) return;
    this.args.cellSelection.body.removeRanges();
    this.args.cellSelection.rowHeader?.removeRanges();
    this.args.cellSelection.colHeader?.removeRanges();
    for (const cellRange of selectedCells) {
      const from: CellCoord = cellRange.getFrom();
      const to: CellCoord = cellRange.getTo();
      this.args.cellSelection.body.addRange(from, to);
      this.args.cellSelection.rowHeader?.addRange(
        createCellCoord(from.getRowId(), 1),
        createCellCoord(to.getRowId(), 1)
      );
      this.args.cellSelection.colHeader?.addRange(
        createCellCoord(1, from.getColId()),
        createCellCoord(1, to.getColId())
      );
    }
    this.args.cellSelection.body.end();
    this.args.cellSelection.rowHeader?.end();
    this.args.cellSelection.colHeader?.end();
  }

  private setCellEditorVisibility(operationDto: OperationDto): void {
    if (!this.args.cellEditor) return;
    const properties: FitUIOperationProperties | undefined =
      this.getOperationProperties(operationDto);
    if (!properties) return;
    const visibility: boolean | undefined = properties.cellEditorVisibility;
    visibility !== undefined && this.args.cellEditor.setVisible(visibility);
  }

  private setCellEditorCoord(operationDto: OperationDto): void {
    if (!this.args.cellEditor) return;
    const properties: FitUIOperationProperties | undefined =
      this.getOperationProperties(operationDto);
    if (!properties) return;
    const cellCoordDto: unknown | undefined = properties.cellEditorCoord;
    const cellCoord: CellCoord | undefined = cellCoordDto
      ? createCellCoord4Dto(cellCoordDto)
      : undefined;
    cellCoord && this.args.cellEditor.setCell(cellCoord);
  }

  private setScrollPosition(operationDto: OperationDto): void {
    const properties: FitUIOperationProperties | undefined =
      this.getOperationProperties(operationDto);
    if (!properties) return;
    const scroll: FitUIOperationScroll | undefined = properties.scroll;
    if (!scroll) return;
    this.args.tableScroller.scrollTo(scroll.left, scroll.top);
  }

  private createRefreshSubscriptions(): void {
    this.refreshAfterExecution('Run');
    this.refreshAfterExecution('Undo');
    this.refreshAfterExecution('Redo');
  }

  private refreshAfterExecution(action: 'Run' | 'Undo' | 'Redo'): void {
    const operationExecutor: OperationExecutor = this.args.operationExecutor;
    let action$: Observable<OperationDto> = operationExecutor.onAfterRun$();
    if (action === 'Undo') action$ = operationExecutor.onAfterUndo$();
    else if (action === 'Redo') action$ = operationExecutor.onAfterRedo$();
    this.subscriptions.add(
      action$.subscribe((operationDto: OperationDto): void => {
        const id: FitUIOperationId = operationDto.id as FitUIOperationId;
        switch (id) {
          case 'cell-remove':
          case 'row-remove':
          case 'column-remove':
            this.refreshIfSelectionExceedsRows();
            this.refreshIfSelectionExceedsCols();
            this.refreshIfAllLinesRemoved();
            this.refreshRows();
            this.refreshCols();
            this.refreshMergedRegions();
            break;
          case 'cell-merge':
          case 'cell-unmerge':
            this.refreshMergedRegions();
            break;
          case 'row-height':
            this.refreshRows();
            break;
          case 'column-width':
            this.refreshCols();
            break;
          case 'row-insert':
            this.refreshRows();
            this.refreshMergedRegions();
            break;
          case 'column-insert':
            this.refreshCols();
            this.refreshMergedRegions();
            break;
        }
        if (this.getOperationProperties(operationDto)?.preventFocus) {
          this.args.cellEditor?.setCell(this.args.cellEditor.getCell());
        } else {
          if (id === 'style-name-copy') {
            this.focusCellEditorControl();
            !this.args.cellSelection?.body.hasFocus() &&
              this.args.cellSelection?.body.setFocus(true);
          } else {
            this.focus(operationDto);
          }
        }
      })
    );
  }

  private refreshIfSelectionExceedsRows(): void {
    const removeData: LastLines | undefined = this.getLastLines();
    if (!removeData) return;
    if (removeData.lastRow >= removeData.lastSelectedRow) return;
    this.args.cellSelection?.body
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(removeData.lastRow, 0))
      .addCell(createCellCoord(removeData.lastRow, removeData.lastCol))
      .end();
    this.args.cellEditor?.setCell(createCellCoord(removeData.lastRow, 0));
  }

  private refreshIfSelectionExceedsCols(): void {
    const lastLines: LastLines | undefined = this.getLastLines();
    if (!lastLines) return;
    if (lastLines.lastCol >= lastLines.lastSelectedCol) return;
    this.args.cellSelection?.body
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(0, lastLines.lastCol))
      .addCell(createCellCoord(lastLines.lastRow, lastLines.lastCol))
      .end();
    this.args.cellSelectionPainter?.paint();
    this.args.cellEditor?.setCell(createCellCoord(0, lastLines.lastCol));
  }

  private getLastLines(): LastLines | undefined {
    const cellRanges: CellRange[] =
      this.args.cellSelection?.body.getRanges() ?? [];
    if (cellRanges.length === 0) return undefined;
    let lastSelectedRow = 0;
    let lastSelectedCol = 0;
    for (const cellRange of cellRanges) {
      const createRow4Dto: number = cellRange.getTo().getRowId();
      if (lastSelectedRow < createRow4Dto) lastSelectedRow = createRow4Dto;
      const toCol: number = cellRange.getTo().getColId();
      if (lastSelectedCol < toCol) lastSelectedCol = toCol;
    }
    if (lastSelectedRow === 0 || lastSelectedCol === 0) return undefined;
    const lastRow: number = this.args.tableViewer.getNumberOfRows() - 1;
    const lastCol: number = this.args.tableViewer.getNumberOfCols() - 1;
    return { lastRow, lastCol, lastSelectedRow, lastSelectedCol };
  }

  private refreshIfAllLinesRemoved(): void {
    const rowNum: number = this.args.tableViewer.getNumberOfRows();
    const colNum: number = this.args.tableViewer.getNumberOfCols();
    if (rowNum > 0 && colNum > 0) return;
    this.args.cellSelection?.clear();
    this.args.cellEditor?.setVisible(false);
  }

  private refreshRows(): void {
    this.args.tableViewer.resetRowProperties();
    this.args.tableScroller.resizeViewportHeight().renderModel();
    this.args.cellSelectionPainter?.paint();
  }

  private refreshCols(): void {
    this.args.tableViewer.resetColProperties();
    this.args.tableScroller.resizeViewportWidth().renderModel();
    this.args.cellSelectionPainter?.paint();
  }

  private refreshMergedRegions(): void {
    this.args.tableViewer.resetMergedRegions();
    this.args.tableScroller.renderMergedRegions();
    this.args.cellEditor?.setCell(this.args.cellEditor?.getCell());
  }

  private focus(operationDto: OperationDto): void {
    const undoState: FitUIOperationProperties | undefined =
      this.getOperationProperties(operationDto);
    if (!undoState) return;
    let cellSelection: CellSelectionRanges | undefined;
    const focus: FitUIOperationFocus | undefined = undoState.focus;
    if (focus === 'Body' || focus === 'CellEditor' || focus === 'ColFilter') {
      cellSelection = this.args.cellSelection?.body;
      this.focusCellEditorControl();
    } else if (focus === 'RowHeader') {
      cellSelection = this.args.cellSelection?.rowHeader;
    } else if (focus === 'ColHeader') {
      cellSelection = this.args.cellSelection?.colHeader;
    } else if (focus === 'PageHeader') {
      cellSelection = this.args.cellSelection?.pageHeader;
    }
    !cellSelection?.hasFocus() && cellSelection?.setFocus(true);
  }

  private getOperationProperties(
    operationDto: OperationDto
  ): FitUIOperationProperties {
    if (operationDto.properties) {
      return operationDto.properties as FitUIOperationProperties;
    } else {
      throw new Error('Missing operation DTO properties!');
    }
  }

  private focusCellEditorControl(): void {
    setTimeout((): void => {
      const cellEditor: CellEditor | undefined = this.args.cellEditor;
      cellEditor?.setCell(cellEditor.getCell());
      cellEditor?.hasFocus() && cellEditor.setFocus(false);
      cellEditor?.getCellControl().setFocus(true);
    });
  }

  private createFilterSubscriptions(): void {
    const operationExecutor: OperationExecutor = this.args.operationExecutor;
    const colFilters: ColFilters | undefined = this.args.colFilters;
    const loadTableFn: ((table: Table) => void) | undefined =
      this.args.loadTableFn;
    if (colFilters && loadTableFn) {
      this.filterSubscriptions = new ColFilterOperationSubscriptions({
        operationExecutor,
        colFilters,
        loadTableFn,
        toolbar: this.args.toolbar,
        contextMenu: this.args.contextMenu,
        cellEditor: this.args.cellEditor,
      });
    }
  }

  public destroy(): void {
    this.subscriptions.forEach((s?: Subscription): void => s?.unsubscribe());
    this.filterSubscriptions?.destroy();
  }
}
