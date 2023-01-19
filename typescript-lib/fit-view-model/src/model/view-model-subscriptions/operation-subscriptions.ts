import { Subject, Subscription } from 'rxjs';

import {
  CellRange,
  CellCoord,
  createCellCoord,
  Table,
} from 'fit-core/model/index.js';
import { Operation, OperationExecutor } from 'fit-core/operations/index.js';
import {
  TableScroller,
  CellEditor,
  CellSelection,
  CellSelectionPainter,
  TableViewer,
  asInputControl,
} from 'fit-core/view-model/index.js';

import { FitOperationId } from '../operation-executor/operation-args.js';

enum OperationProperties {
  SelectedCells = 1,
  CellEditor = 2,
  VerticalScrollbar = 3,
  HorizontalScrollbar = 4,
}

type LastLines = {
  lastRow: number;
  lastCol: number;
  lastSelectedRow: number;
  lastSelectedCol: number;
};

export type OperationSubscriptionArgs = {
  operationExecutor: OperationExecutor;
  tableScroller: TableScroller;
  tableViewer: TableViewer;
  cellEditor?: CellEditor;
  cellSelection?: CellSelection;
  cellSelectionPainter?: CellSelectionPainter;
};

export class OperationSubscriptions {
  private selectedBodyCells?: CellRange[];
  private readonly subscriptions: Subscription[] = [];

  constructor(private args: OperationSubscriptionArgs) {}

  public init(): void {
    this.args.cellSelection &&
      this.subscriptions.push(this.setSelectedBodyCells$());
    this.createCommonSubscriptions();
    this.createCustomSubscriptions();
  }

  private setSelectedBodyCells$(): Subscription {
    const selectedCells$: Subject<CellRange[]> = new Subject();
    this.args.cellSelection?.body.addOnEnd$(selectedCells$);
    return selectedCells$.subscribe((selectedCells: CellRange[]): void => {
      this.selectedBodyCells = selectedCells;
    });
  }

  private createCommonSubscriptions(): void {
    this.args.operationExecutor.addListener({
      onAfterRun$: this.afterCommonUpdate$,
      onAfterUndo$: this.afterUndoRedo$,
      onAfterRedo$: this.afterUndoRedo$,
    });
  }

  private readonly afterCommonUpdate$ = (): Subject<Operation> => {
    const selectedCells$: Subject<Operation> = new Subject();
    this.subscriptions.push(
      selectedCells$.subscribe((operation: Operation): void => {
        this.markSelectedCells(operation);
        this.markCellEditorPosition(operation);
        this.markScrollPosition(operation);
        this.restoreFocus();
      })
    );
    return selectedCells$;
  };

  private readonly markSelectedCells = (operation: Operation): void => {
    if (!this.selectedBodyCells) return;
    operation.properties[OperationProperties.SelectedCells] =
      this.selectedBodyCells;
  };

  private readonly markCellEditorPosition = (operation: Operation): void => {
    if (!this.args.cellEditor?.isVisible()) return;
    const cellCoord: CellCoord = this.args.cellEditor.getCell();
    operation.properties[OperationProperties.CellEditor] = cellCoord;
    this.args.cellEditor.setCell(cellCoord);
    asInputControl(this.args.cellEditor?.getCellControl())?.focus$.next(true);
  };

  private readonly markScrollPosition = (operation: Operation): void => {
    const top: number = this.args.tableScroller.getTop();
    operation.properties[OperationProperties.VerticalScrollbar] = top;
    const left: number = this.args.tableScroller.getLeft();
    operation.properties[OperationProperties.HorizontalScrollbar] = left;
  };

  private readonly afterUndoRedo$ = (): Subject<Operation> => {
    const selectCells$: Subject<Operation> = new Subject();
    this.subscriptions.push(
      selectCells$.subscribe((operation: Operation): void => {
        this.selectMarkedCells(operation);
        this.setCellEditorPosition(operation);
        this.setScrollPosition(operation);
        this.restoreFocus();
      })
    );
    return selectCells$;
  };

  private selectMarkedCells(operation: Operation): void {
    if (!this.args.cellSelection) return;
    this.args.cellSelection.body.removeRanges();
    const id: number = OperationProperties.SelectedCells;
    const operationProperty: unknown = operation.properties[id];
    if (!operationProperty) return;
    const selectedCells: CellRange[] = operationProperty as CellRange[];
    for (const cellRange of selectedCells) {
      this.args.cellSelection.body.addRange(
        cellRange.getFrom(),
        cellRange.getTo()
      );
    }
    this.args.cellSelection.body.end();
  }

  private readonly setCellEditorPosition = (operation: Operation): void => {
    if (!this.args.cellEditor) return;
    const id: number = OperationProperties.CellEditor;
    const cellCoord: unknown = operation.properties[id];
    if (cellCoord) {
      this.args.cellEditor.setCell(cellCoord as CellCoord);
      asInputControl(this.args.cellEditor?.getCellControl())?.focus$.next(true);
    } else if (this.args.cellEditor.isVisible()) {
      this.args.cellEditor.setVisible(false);
    }
  };

  private readonly setScrollPosition = (operation: Operation): void => {
    const topId: number = OperationProperties.VerticalScrollbar;
    const top: number = operation.properties[topId] as number;
    const leftId: number = OperationProperties.HorizontalScrollbar;
    const left: number = operation.properties[leftId] as number;
    this.args.tableScroller.scrollTo(left, top);
  };

  private readonly restoreFocus = (): void => {
    setTimeout((): void => {
      this.args.cellSelection?.body.setFocus(true);
      asInputControl(this.args.cellEditor?.getCellControl())?.focus$.next(true);
    });
  };

  private createCustomSubscriptions(): void {
    this.args.operationExecutor.addListener({
      onAfterRun$: this.afterCustomUpdate$,
      onAfterUndo$: this.afterCustomUpdate$,
      onAfterRedo$: this.afterCustomUpdate$,
    });
  }

  private readonly afterCustomUpdate$ = (): Subject<Operation> => {
    const refresh$: Subject<Operation> = new Subject();
    this.subscriptions.push(
      refresh$.subscribe((operation: Operation) => {
        const operationId: FitOperationId = operation.id as FitOperationId;
        switch (operationId) {
          case 'row-remove':
            this.whenSelectionExceedsRows();
            this.whenAllLinesRemoved();
            this.refreshRows();
            this.refreshMergedRegions();
            break;
          case 'column-remove':
            this.whenSelectionExceedsColumns();
            this.whenAllLinesRemoved();
            this.refreshColumns();
            this.refreshMergedRegions();
            break;
          case 'row-height':
            this.refreshRows();
            break;
          case 'column-width':
            this.refreshColumns();
            break;
          case 'row-insert':
            this.refreshRows();
            this.refreshMergedRegions();
            break;
          case 'column-insert':
            this.refreshColumns();
            this.refreshMergedRegions();
            break;
          case 'cell-merge':
          case 'cell-unmerge':
            this.refreshMergedRegions();
            break;
        }
      })
    );
    return refresh$;
  };

  private whenSelectionExceedsRows(): void {
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

  private whenSelectionExceedsColumns(): void {
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
    for (let cellRange of cellRanges) {
      const createRow4Dto: number = cellRange.getTo().getRowId();
      if (lastSelectedRow < createRow4Dto) lastSelectedRow = createRow4Dto;
      const toCol: number = cellRange.getTo().getColId();
      if (lastSelectedCol < toCol) lastSelectedCol = toCol;
    }
    if (lastSelectedRow === 0 || lastSelectedCol === 0) return undefined;
    const table: Table = this.args.tableViewer.getTable();
    const lastRow: number = table.getNumberOfRows() - 1;
    const lastCol: number = table.getNumberOfColumns() - 1;
    return { lastRow, lastCol, lastSelectedRow, lastSelectedCol };
  }

  private whenAllLinesRemoved(): void {
    const rowNum: number = this.args.tableViewer.getTable().getNumberOfRows();
    const colNum: number = this.args.tableViewer
      .getTable()
      .getNumberOfColumns();
    if (rowNum > 0 && colNum > 0) return;
    this.args.cellSelection?.clear();
    this.args.cellEditor?.setVisible(false);
  }

  private refreshRows(): void {
    this.args.tableViewer.resetRowProperties();
    this.args.tableScroller.resizeViewportHeight().renderTable();
    this.args.cellSelectionPainter?.paint();
  }

  private refreshColumns(): void {
    this.args.tableViewer.resetColumnProperties();
    this.args.tableScroller.resizeViewportWidth().renderTable();
    this.args.cellSelectionPainter?.paint();
  }

  private refreshMergedRegions(): void {
    this.args.tableViewer.resetMergedRegions();
    this.args.tableScroller.renderMergedRegions();
    this.args.cellEditor?.setCell(this.args.cellEditor?.getCell());
  }

  public destroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}
