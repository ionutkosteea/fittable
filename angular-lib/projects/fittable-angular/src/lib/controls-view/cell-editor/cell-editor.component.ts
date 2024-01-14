import { Subscription } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CssStyle, Value, CellCoord } from 'fittable-core/model';
import {
  CellEditor,
  CellEditorListener,
  InputControl,
  Rectangle,
  getViewModelConfig,
  Option,
} from 'fittable-core/view-model';

@Component({
  selector: 'fit-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrl: 'cell-editor.component.scss',
})
export class CellEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() cellEditorListener!: CellEditorListener;
  @Input() getCellStyle!: (rowId: number, colId: number) => CssStyle | null;
  @ViewChild('textArea') textAreaRef!: ElementRef;
  cellEditorStyle: CssStyle = {};
  textAreaStyle: CssStyle = {};
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initCellEditor();
    this.createCellEditorSubscriptions();
    this.createCellEditorInputSubscriptions();
  }

  ngAfterViewInit(): void {
    this.updateTextAreaDimensions();
    this.updateTextAreaValue(
      this.cellEditorListener.cellEditor.getCellControl().getValue()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }

  onTextAreaMouseEnter(event: MouseEvent): void {
    this.cellEditorListener.onMouseEnter(event);
  }

  onTextAreaMouseDown(event: MouseEvent): void {
    this.cellEditorListener.onMouseDown(event);
  }

  onGlobalMouseDown(): void {
    this.cellEditorListener.onGlobalMouseDown();
  }

  onGlobalMouseUp(): void {
    this.cellEditorListener.onGlobalMouseUp();
  }

  onTextAreaKeyDown(event: KeyboardEvent): void {
    this.cellEditorListener.onKeyDown(event);
  }

  onTextAreaInput(event: Event): void {
    this.cellEditorListener.onInput(event);
  }

  onTextAreaContextMenu(event: MouseEvent): void {
    this.cellEditorListener.onContextMenu(event);
  }

  private initCellEditor(): void {
    this.updateCellEditorVisibility(true);
    this.updateCellEditorRectangle();
    this.updateTextAreaCellStyle();
  }

  private createCellEditorSubscriptions(): void {
    const cellEditor: CellEditor = this.cellEditorListener.cellEditor;
    this.subscriptions.push(
      cellEditor.onAfterSetCell$().subscribe((): void => {
        this.updateCellEditorRectangle();
        this.updateTextAreaCellStyle();
        this.updateTextAreaDimensions();
      })
    );
    this.subscriptions.push(
      cellEditor.onAfterSetVisible$().subscribe((visible: boolean): void => {
        this.updateCellEditorVisibility(visible);
      })
    );
    this.subscriptions.push(
      cellEditor
        .onAfterSetPointerEvents$()
        .subscribe((events: boolean): void => {
          this.updateCellEditorPointerEvents(events);
        })
    );
  }

  private createCellEditorInputSubscriptions(): void {
    const inputControl: InputControl = this.getInputControl();
    this.subscriptions.push(
      inputControl.onSetFocus$().subscribe((enable: boolean): void => {
        this.focusTextArea(enable);
      })
    );
    this.subscriptions.push(
      inputControl
        .onScrollToEnd$()
        .subscribe((): void => this.textAreaScrollToEnd())
    );
    this.subscriptions.push(
      inputControl
        .onCtrlEnter$()
        .subscribe((): void => this.textAreaCtrlEnter())
    );
    this.subscriptions.push(
      inputControl
        .onSetValue$()
        .subscribe((value?: Value): void => this.updateTextAreaValue(value))
    );
    this.subscriptions.push(
      inputControl.onSetTextCursor$().subscribe((cursor: boolean): void => {
        this.updateTextAreaCaretColor(cursor);
      })
    );
  }

  private updateCellEditorVisibility(visible: boolean): void {
    this.cellEditorStyle['display'] = visible ? 'block' : 'none';
  }

  private updateCellEditorRectangle(): void {
    const rect: Rectangle | undefined =
      this.cellEditorListener.cellEditor.getCellRectangle();
    if (!rect) return;
    this.cellEditorStyle['left'] = rect.left + 'px';
    this.cellEditorStyle['top'] = rect.top + 'px';
    this.cellEditorStyle['width'] = rect.width + 'px';
    this.cellEditorStyle['height'] = rect.height + 'px';
  }

  private updateCellEditorPointerEvents(events: boolean): void {
    this.cellEditorStyle['pointer-events'] = events ? 'auto' : 'none';
  }

  private focusTextArea(enable: boolean): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    if (enable) return textArea.focus({ preventScroll: true });
    else return textArea.blur();
  }

  private updateTextAreaCaretColor(caret: boolean): void {
    this.textAreaStyle['caret-color'] = caret ? 'auto' : 'transparent';
  }

  private updateTextAreaCellStyle(): void {
    Object.keys(this.textAreaStyle).forEach((value: string): void => {
      if (value === 'caret-color') return;
      delete this.textAreaStyle[value];
    });
    const cellCoord: CellCoord = this.cellEditorListener.cellEditor.getCell();
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    const cellStyle: CssStyle | null = this.getCellStyle(rowId, colId);
    if (cellStyle) {
      for (const name of Object.keys(cellStyle)) {
        this.textAreaStyle[name] = cellStyle[name];
      }
    }
    if (!this.textAreaStyle['font-size.px']) {
      this.textAreaStyle['font-size.px'] = this.getTextAreaFontSize();
    }
    if (!this.textAreaStyle['font-family']) {
      this.textAreaStyle['font-family'] = this.getTextAreaFontFamily();
    }
  }

  private getTextAreaFontSize(): number {
    return getViewModelConfig().fontSize;
  }

  private getTextAreaFontFamily(): string | undefined {
    const fonts: Option[] | undefined = getViewModelConfig().fontFamily;
    return fonts ? fonts[0].value : undefined;
  }

  private updateTextAreaDimensions(): void {
    const rect: Rectangle | undefined =
      this.cellEditorListener.cellEditor.getCellRectangle();
    if (!rect) return;
    this.textAreaRef.nativeElement.style['min-height'] = rect.height + 'px';
    this.textAreaRef.nativeElement.style['min-width'] = rect.width + 'px';
    this.textAreaRef.nativeElement.style.height = rect.height + 'px';
    this.textAreaRef.nativeElement.style.width = rect.width + 'px';
  }

  private textAreaScrollToEnd(): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    textArea.scrollTop = textArea.scrollHeight;
    textArea.scrollLeft = textArea.scrollWidth;
  }

  private textAreaCtrlEnter(): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    const textCursor: number = textArea.selectionStart;
    const start: string = textArea.value.slice(0, textCursor);
    const end: string = textArea.value.slice(textCursor);
    textArea.value = start + '\n' + end;
    textArea.selectionEnd = textCursor + 1;
  }

  private updateTextAreaValue(value?: Value): void {
    this.getTextArea().value = value === undefined ? '' : '' + value;
  }

  private getTextArea(): HTMLTextAreaElement {
    return this.textAreaRef.nativeElement as HTMLTextAreaElement;
  }

  private getInputControl(): InputControl {
    return this.cellEditorListener.cellEditor.getCellControl();
  }
}
