import { Observable, Subject } from 'rxjs';

import { implementsTKeys } from 'fit-core/common/index.js';
import { CellCoord, CellRange, Value } from 'fit-core/model/index.js';
import {
  CellEditor,
  CellEditorListener,
  CellEditorListenerFactory,
  FitEvent,
  FitHtmlElement,
  FitHtmlInputElement,
  FitKeyboardEvent,
  FitMouseEvent,
  InputControl,
  NeighborCells,
} from 'fit-core/view-model/index.js';

import { getCellCoord } from '../model/common/fit-html-attributes.js';

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
  private enableControlKeys = false;
  private enableControlEdit = false;
  private cellValue?: Value;
  private newCellValue?: string;
  private selectedCells: CellRange[] = [];
  private isMouseDown = false;
  private isGlobalMouseDown = false;
  private contextMenu$: Subject<FitMouseEvent> = new Subject();

  constructor(
    public readonly cellEditor: CellEditor,
    private readonly selectedCellsFn: () => CellRange[]
  ) {}

  public onShow(event: FitMouseEvent): void {
    event.preventDefault();
    if (event.shiftKey) {
      this.enableControlEdit && this.enableControlEditAndKeys(false);
      this.setInputFocus(true);
      return;
    }
    const cellCoord: CellCoord = getCellCoord(event.target as FitHtmlElement);
    if (event.button !== 0) {
      for (const cellRange of this.selectedCells) {
        const rowId: number = cellCoord.getRowId();
        const cellId: number = cellCoord.getColId();
        if (cellRange.hasCell(rowId, cellId)) {
          this.setInputFocus(false);
          return;
        }
      }
    }
    this.applyNewCellValue();
    this.moveCellEditor(cellCoord);
    if (event.button !== 0) this.setInputFocus(false);
  }

  public onMouseEnter(): void {
    if (!this.isGlobalMouseDown) return;
    // Disable pointer events for 50 ms, for enabling underlying mouse events.
    this.cellEditor.setPointerEvents(false);
    setTimeout((): void => {
      this.cellEditor.setPointerEvents(true);
    }, 50);
  }

  public onMouseDown(event?: FitMouseEvent): void {
    this.isMouseDown = true;
    if (this.enableControlKeys) return;
    if (event?.button !== 0) {
      this.setInputFocus(false);
      return;
    }
    this.enableControlEditAndKeys(true);
    this.cellEditor.getCellControl().scrollToEnd();
  }

  public onGlobalMouseDown(): void {
    this.isGlobalMouseDown = true;
  }

  public onGlobalMouseUp(): void {
    if (this.isMouseDown) {
      this.isMouseDown = false;
    } else {
      this.enableControlEditAndKeys(false);
      this.selectedCells = this.selectedCellsFn();
      this.isGlobalMouseDown = false;
    }
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
    else if (key === 'Meta' || key === 'Control') event.preventDefault();
    else if (key !== 'Shift') this.regularKeyDown(event);
  }

  private enterDown(event: FitKeyboardEvent): void {
    event.preventDefault();
    if (this.enableControlEdit) {
      if (event.ctrlKey) {
        this.cellEditor.getCellControl().ctrlEnter();
        this.newCellValue = this.getHtmlInput(event)?.value ?? '';
      } else {
        this.applyNewCellValue();
        this.moveCellEditor(this.cellEditor.getNeighborCells().getBottomCell());
      }
    } else {
      this.enableControlEditAndKeys(true);
      this.cellEditor.getCellControl().scrollToEnd();
    }
  }

  private escapeDown(event: FitKeyboardEvent): void {
    event.preventDefault();
    this.cellEditor.getCellControl().setValue(this.cellValue);
    const htmlInput: FitHtmlInputElement | undefined = this.getHtmlInput(event);
    const inputValue: string =
      this.cellValue === undefined ? '' : '' + this.cellValue;
    if (htmlInput) htmlInput.value = inputValue;
    this.cellEditor.setCell(this.cellEditor.getCell()); // Trigger setCell event.
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

  private regularKeyDown(event: FitKeyboardEvent): void {
    if (event.metaKey) return;
    if (this.enableControlEdit) return;
    this.enableControlEdit = true;
    this.cellEditor.getCellControl().setTextCursor(true);
    this.cellEditor.getCellControl().setValue();
  }

  public onInput(event: FitEvent): void {
    this.newCellValue = this.getHtmlInput(event)?.value ?? '';
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
    this.setInputFocus(true);
    this.enableControlEditAndKeys(false);
  }

  private setInputFocus(focus: boolean): void {
    setTimeout((): void => {
      this.cellEditor.getCellControl().setFocus(focus);
    });
  }

  private enableControlEditAndKeys(enable: boolean): void {
    this.cellEditor.hasFocus() !== enable && this.cellEditor.setFocus(enable);
    this.enableControlEdit = enable;
    this.cellEditor.getCellControl().setTextCursor(enable);
    this.enableControlKeys = enable;
  }

  private getHtmlInput(event: FitEvent): FitHtmlInputElement | undefined {
    return implementsTKeys<FitHtmlInputElement>(event.target, ['value'])
      ? event.target
      : undefined;
  }
}

export class FitCellEditorListenerFactory implements CellEditorListenerFactory {
  public createCellEditorListener(
    cellEditor: CellEditor,
    selectedCellsFn: () => CellRange[]
  ): CellEditorListener {
    return new FitCellEditorListener(cellEditor, selectedCellsFn);
  }
}
