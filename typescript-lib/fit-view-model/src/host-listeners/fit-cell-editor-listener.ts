import { Observable, Subject } from 'rxjs';

import { implementsTKeys } from 'fit-core/common/index.js';
import {
  CellCoord,
  CellRange,
  createCellCoord,
  Value,
} from 'fit-core/model/index.js';
import {
  CellEditor,
  CellEditorListener,
  CellEditorListenerFactory,
  FitEvent,
  FitHTMLInputElement,
  FitKeyboardEvent,
  FitMouseEvent,
  InputControl,
  NeighborCells,
} from 'fit-core/view-model/index.js';

type ActionKey =
  | 'Enter'
  | 'Escape'
  | 'Control'
  | 'Shift'
  | 'Backspace'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'Meta';

export class FitCellEditorListener implements CellEditorListener {
  private cellEditor!: CellEditor;
  private enableControlKeys = false;
  private enableControlEdit = false;
  private cellValue?: Value;
  private newCellValue?: string;
  private selectedCellsFn: () => CellRange[] = () => [];
  private selectedCells: CellRange[] = [];
  private isMouseDown = false;
  private contextMenu$: Subject<FitMouseEvent> = new Subject();

  public setCellEditor(cellEditor: CellEditor): this {
    this.cellEditor = cellEditor;
    return this;
  }

  public getCellEditor(): CellEditor {
    return this.cellEditor;
  }

  public setSelectedCells(selectedCellsFn: () => CellRange[]): this {
    this.selectedCellsFn = selectedCellsFn;
    return this;
  }

  public onShow(cellCoord: CellCoord, event?: FitMouseEvent): void {
    event?.preventDefault();
    if (event?.shiftKey) {
      this.enableControlEdit && this.enableControlEditAndKeys(false);
      this.cellEditor.getCellControl().focus$.next(true);
      return;
    }
    if (event?.button !== 0) {
      for (const cellRange of this.selectedCells) {
        const rowId: number = cellCoord.getRowId();
        const cellId: number = cellCoord.getColId();
        if (cellRange.hasCell(rowId, cellId)) return;
      }
    }
    this.applyNewCellValue();
    this.moveCellEditor(cellCoord);
    if (event?.button !== 0) {
      this.cellEditor.getCellControl().focus$.next(false);
    }
  }

  public onInit(): void {
    this.moveCellEditor(createCellCoord(0, 0));
  }

  public onMouseEnter(): void {
    if (!this.isMouseDown) return;
    this.cellEditor.setPointerEvents(false);
    setTimeout(() => this.cellEditor.setPointerEvents(true), 50);
  }

  public onMouseDown(event: FitMouseEvent): void {
    if (this.enableControlKeys) return;
    if (event.button !== 0) return;
    this.enableControlEditAndKeys(true);
    this.cellEditor.getCellControl().scrollToEnd$?.next();
  }

  public onGlobalMouseDown(): void {
    this.isMouseDown = true;
  }

  public onGlobalMouseUp(): void {
    this.isMouseDown = false;
    this.selectedCells = this.selectedCellsFn();
  }

  public onKeyDown(event: FitKeyboardEvent): void {
    if (event.shiftKey && !this.enableControlKeys) return;
    const key: ActionKey = event.key as ActionKey;
    const origin: NeighborCells = this.cellEditor.getNeighborCells();
    if (key === 'Enter') this.enterDown(event);
    else if (key === 'Escape') this.escapeDown(event);
    else if (key === 'Backspace') this.backspaceDown();
    else if (key === 'ArrowLeft') this.arrowDown(origin.getLeftCell(), event);
    else if (key === 'ArrowUp') this.arrowDown(origin.getTopCell(), event);
    else if (key === 'ArrowRight') this.arrowDown(origin.getRightCell(), event);
    else if (key === 'ArrowDown') this.arrowDown(origin.getBottomCell(), event);
    else if (key === 'Meta') event.preventDefault();
    else if (key !== 'Shift' && key !== 'Control') this.regularKeyDown();
  }

  private enterDown(event: FitKeyboardEvent): void {
    event.preventDefault();
    if (this.enableControlEdit) {
      if (event.ctrlKey) {
        this.cellEditor.getCellControl().ctrlEnter$?.next();
      } else {
        this.applyNewCellValue();
        this.moveCellEditor(this.cellEditor.getNeighborCells().getBottomCell());
      }
    } else {
      this.enableControlEditAndKeys(true);
      this.cellEditor.getCellControl().scrollToEnd$?.next();
    }
  }

  private escapeDown(event: FitKeyboardEvent): void {
    event.preventDefault();
    this.cellEditor.getCellControl().setValue(this.cellValue);
    const htmlInput: FitHTMLInputElement | undefined = this.getHtmlInput(event);
    const inputValue: string =
      this.cellValue === undefined ? '' : '' + this.cellValue;
    if (htmlInput) htmlInput.value = inputValue;
    this.enableControlEditAndKeys(false);
    this.newCellValue = undefined;
  }

  private backspaceDown(): void {
    if (this.enableControlEdit) return;
    this.cellEditor.getCellControl().setValue();
    this.newCellValue = '';
  }

  private arrowDown(cellCoord: CellCoord, event: FitKeyboardEvent): void {
    if (this.enableControlKeys) return;
    if (event.shiftKey) return;
    this.applyNewCellValue();
    this.moveCellEditor(cellCoord);
  }

  private regularKeyDown(): void {
    if (this.enableControlEdit) return;
    this.enableControlEdit = true;
    this.cellEditor.getCellControl().setTextCursor(true);
    this.cellEditor.getCellControl().setValue();
  }

  public onInput(event: FitEvent): void {
    this.newCellValue = this.getHtmlInput(event)?.value;
    this.selectedCells = this.selectedCellsFn();
  }

  public onContextMenu(event: FitMouseEvent): void {
    if (this.enableControlEdit) return;
    event?.preventDefault();
    this.contextMenu$.next(event);
  }

  public onContextMenu$(): Observable<FitMouseEvent> {
    return this.contextMenu$.asObservable();
  }

  private applyNewCellValue(): void {
    if (this.newCellValue === undefined) return;
    const inputControl: InputControl = this.cellEditor.getCellControl();
    if (this.newCellValue === inputControl.getValue()) return;
    else if (this.newCellValue === '') inputControl.setValue().run();
    else inputControl.setValue(this.newCellValue).run();
    this.newCellValue = undefined;
  }

  private moveCellEditor(cell: CellCoord) {
    !this.cellEditor.isVisible() && this.cellEditor.setVisible(true);
    this.cellEditor.setCell(cell);
    const inputControl: InputControl = this.cellEditor.getCellControl();
    this.cellValue = inputControl.getValue();
    inputControl.forceValue$?.next(this.cellValue);
    inputControl.focus$.next(true);
    this.enableControlEditAndKeys(false);
  }

  private enableControlEditAndKeys(enable: boolean): void {
    this.enableControlEdit = enable;
    this.cellEditor.getCellControl().setTextCursor(enable);
    this.enableControlKeys = enable;
    this.cellEditor.setFocus(enable);
  }

  private getHtmlInput(event: FitEvent): FitHTMLInputElement | undefined {
    return implementsTKeys<FitHTMLInputElement>(event.target, ['value'])
      ? event.target
      : undefined;
  }
}

export class FitCellEditorListenerFactory implements CellEditorListenerFactory {
  public createCellEditorListener(): CellEditorListener {
    return new FitCellEditorListener();
  }
}
