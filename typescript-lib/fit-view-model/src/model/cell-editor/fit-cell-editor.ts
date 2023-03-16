import { Subject, Observable } from 'rxjs';

import {
  Value,
  CellCoord,
  createCellCoord,
  createCellRange,
} from 'fit-core/model/index.js';
import { OperationExecutor } from 'fit-core/operations/index.js';
import {
  CellEditor,
  CellEditorFactory,
  InputControl,
  NeighborCells,
  Rectangle,
  TableViewer,
} from 'fit-core/view-model/index.js';

import { FitInputControl } from '../common/controls/fit-input-control.js';
import { FitUIOperationArgs } from '../operation-executor/operation-args.js';
import { FitNeighborCells } from '../common/fit-neighbor-cells.js';

export class FitCellEditor implements CellEditor {
  private cellCoord: CellCoord = createCellCoord(0, 0);
  private readonly afterSetCell$: Subject<CellCoord> = new Subject();
  private cellControl: InputControl;
  private cellRectangle?: Rectangle;
  private visible = false;
  private readonly afterSetVisible$: Subject<boolean> = new Subject();
  private pointerEvents = true;
  private readonly afterSetPointerEvents$: Subject<boolean> = new Subject();
  private focus = false;
  private readonly afterSetFocus$: Subject<boolean> = new Subject();

  constructor(
    private readonly operationExecutor: OperationExecutor,
    private readonly tableViewer: TableViewer
  ) {
    this.cellControl = this.createCellControl();
  }

  private createCellControl(): InputControl {
    const input: FitInputControl = new FitInputControl();
    input //
      .setLabel(() => 'Cell Editor')
      .setRun((): void => {
        const args: FitUIOperationArgs = {
          id: 'cell-value',
          selectedCells: [createCellRange(this.cellCoord)],
          value: input.getValue(),
        };
        this.operationExecutor.run(args);
      });
    return input;
  }

  public getCellControl(): InputControl {
    return this.cellControl;
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public setVisible(visible: boolean): this {
    this.visible = visible;
    this.afterSetVisible$.next(visible);
    return this;
  }

  public onAfterSetVisible$(): Observable<boolean> {
    return this.afterSetVisible$.asObservable();
  }

  public getCell(): CellCoord {
    return this.cellCoord;
  }

  public setCell(cellCoord: CellCoord): this {
    this.cellCoord = cellCoord;
    this.update();
    this.afterSetCell$.next(cellCoord);
    return this;
  }

  public onAfterSetCell$(): Observable<CellCoord> {
    return this.afterSetCell$.asObservable();
  }

  private update(): void {
    if (!this.tableHasRowsAndCols()) return;
    this.cellRectangle = this.createCellRectangle(this.cellCoord);
    this.cellControl.setValue(this.getTableCellValue(this.cellCoord));
  }

  private tableHasRowsAndCols(): boolean {
    const rowNum: number = this.tableViewer.getNumberOfRows();
    const colNum: number = this.tableViewer.getNumberOfCols();
    return rowNum > 0 && colNum > 0;
  }

  private getTableCellValue(cellCoord: CellCoord): Value {
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    const value: Value | undefined = //
      this.tableViewer.getCellValue(rowId, colId);
    return value === undefined ? '' : value;
  }

  private createCellRectangle(cellCoord: CellCoord): Rectangle {
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    const left: number =
      this.tableViewer.getRowHeaderWidth() +
      this.tableViewer.getColPosition(colId);
    const top: number =
      this.tableViewer.getColHeaderHeight() +
      this.tableViewer.getRowPosition(rowId);
    let width: number = this.tableViewer.getColWidth(colId);
    const colSpan: number = this.tableViewer.getColSpan(rowId, colId);
    if (colSpan > 1) {
      for (let i = colId + 1; i < colId + colSpan; i++) {
        width += this.tableViewer.getColWidth(i);
      }
    }
    let height: number = this.tableViewer.getRowHeight(rowId);
    const rowSpan: number = this.tableViewer.getRowSpan(rowId, colId);
    if (rowSpan > 1) {
      for (let i = rowId + 1; i < rowId + rowSpan; i++) {
        height += this.tableViewer.getRowHeight(i);
      }
    }
    return { left, top, width, height };
  }

  public getCellRectangle(): Rectangle | undefined {
    return this.cellRectangle;
  }

  public getNeighborCells(): NeighborCells {
    return new FitNeighborCells()
      .setTableViewer(this.tableViewer)
      .setCell(this.cellCoord);
  }

  public hasFocus(): boolean {
    return this.focus;
  }

  public setFocus(focus: boolean, ignoreTrigger?: boolean): this {
    this.focus = focus;
    !ignoreTrigger && this.afterSetFocus$.next(focus);
    return this;
  }

  public onAfterSetFocus$(): Observable<boolean> {
    return this.afterSetFocus$.asObservable();
  }

  public hasPointerEvents(): boolean {
    return this.pointerEvents;
  }

  public setPointerEvents(events: boolean): this {
    this.pointerEvents = events;
    this.afterSetPointerEvents$.next(events);
    return this;
  }

  public onAfterSetPointerEvents$(): Observable<boolean> {
    return this.afterSetPointerEvents$.asObservable();
  }
}

export class FitCellEditorFactory implements CellEditorFactory {
  public createCellEditor(
    executor: OperationExecutor,
    tableViewer: TableViewer
  ): CellEditor {
    return new FitCellEditor(executor, tableViewer);
  }
}
