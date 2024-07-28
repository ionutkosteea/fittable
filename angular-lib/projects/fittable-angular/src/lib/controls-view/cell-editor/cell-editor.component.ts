import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';

import { CssStyle, Value, CellCoord } from 'fittable-core/model';
import {
  CellEditor,
  CellEditorListener,
  InputControl,
  Rectangle,
  getViewModelConfig,
  Option,
} from 'fittable-core/view-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fit-cell-editor',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './cell-editor.component.html',
  styleUrl: 'cell-editor.component.scss',
})
export class CellEditorComponent implements OnInit, AfterViewInit {
  cellEditorListener = input.required<CellEditorListener>();
  getCellStyle = input.required<(rowId: number, colId: number) => CssStyle | null>();

  @ViewChild('textArea') textAreaRef!: ElementRef;
  protected readonly cellEditorStyle = signal<CssStyle>({});
  protected readonly textAreaStyle = signal<CssStyle>({});
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initCellEditor();
    this.createCellEditorSubscriptions();
    this.createCellEditorInputSubscriptions();
  }

  ngAfterViewInit(): void {
    this.updateTextAreaDimensions();
    this.updateTextAreaValue(
      this.cellEditorListener().cellEditor.getCellControl().getValue()
    );
  }

  onTextAreaMouseEnter(event: MouseEvent): void {
    this.cellEditorListener().onMouseEnter(event);
  }

  onTextAreaMouseDown(event: MouseEvent): void {
    this.cellEditorListener().onMouseDown(event);
  }

  onGlobalMouseDown(): void {
    this.cellEditorListener().onGlobalMouseDown();
  }

  onGlobalMouseUp(): void {
    this.cellEditorListener().onGlobalMouseUp();
  }

  onTextAreaKeyDown(event: KeyboardEvent): void {
    this.cellEditorListener().onKeyDown(event);
  }

  onTextAreaInput(event: Event): void {
    this.cellEditorListener().onInput(event);
  }

  onTextAreaContextMenu(event: MouseEvent): void {
    this.cellEditorListener().onContextMenu(event);
  }

  private initCellEditor(): void {
    this.updateCellEditorVisibility(true);
    this.updateCellEditorRectangle();
    this.updateTextAreaCellStyle();
  }

  private createCellEditorSubscriptions(): void {
    const cellEditor: CellEditor = this.cellEditorListener().cellEditor;
    cellEditor.onAfterSetCell$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((): void => {
        this.updateCellEditorRectangle();
        this.updateTextAreaCellStyle();
        this.updateTextAreaDimensions();
      })
    cellEditor.onAfterSetVisible$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visible: boolean): void => {
        this.updateCellEditorVisibility(visible);
      })
    cellEditor.onAfterSetPointerEvents$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((events: boolean): void => {
        this.updateCellEditorPointerEvents(events);
      })
  }

  private createCellEditorInputSubscriptions(): void {
    const inputControl: InputControl = this.getInputControl();
    inputControl.onSetFocus$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((enable: boolean): void => {
        this.focusTextArea(enable);
      })
    inputControl.onScrollToEnd$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((): void => this.textAreaScrollToEnd())
    inputControl.onCtrlEnter$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((): void => this.textAreaCtrlEnter())
    inputControl.onSetValue$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value?: Value): void => this.updateTextAreaValue(value))
    inputControl.onSetTextCursor$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cursor: boolean): void => {
        this.updateTextAreaCaretColor(cursor);
      })
  }

  private updateCellEditorVisibility(visible: boolean): void {
    this.cellEditorStyle.update((style: CssStyle) => {
      const newStyle = { ...style };
      newStyle['display'] = visible ? 'block' : 'none';
      return newStyle;
    })
  }

  private updateCellEditorRectangle(): void {
    this.cellEditorStyle.update((style: CssStyle) => {
      const newStyle = { ...style };
      const rect: Rectangle | undefined =
        this.cellEditorListener().cellEditor.getCellRectangle();
      if (rect) {
        newStyle['left'] = rect.left + 'px';
        newStyle['top'] = rect.top + 'px';
        newStyle['width'] = rect.width + 'px';
        newStyle['height'] = rect.height + 'px';
      }
      return newStyle;
    });
  }

  private updateCellEditorPointerEvents(events: boolean): void {
    this.cellEditorStyle.update((style: CssStyle) => {
      const newStyle = { ...style };
      newStyle['pointer-events'] = events ? 'auto' : 'none';
      return newStyle;
    })
  }

  private focusTextArea(enable: boolean): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    if (enable) return textArea.focus({ preventScroll: true });
    else return textArea.blur();
  }

  private updateTextAreaCaretColor(caret: boolean): void {
    this.textAreaStyle.update((style: CssStyle) => {
      const newStyle = { ...style };
      newStyle['caret-color'] = caret ? 'auto' : 'transparent';
      return newStyle;
    })
  }

  private updateTextAreaCellStyle(): void {
    this.textAreaStyle.update((style: CssStyle) => {
      const newStyle = { ...style };
      Object.keys(newStyle).forEach((value: string): void => {
        if (value === 'caret-color') return;
        delete newStyle[value];
      });
      const cellCoord: CellCoord = this.cellEditorListener().cellEditor.getCell();
      const rowId: number = cellCoord.getRowId();
      const colId: number = cellCoord.getColId();
      const cellStyleFn = this.getCellStyle();
      const cellStyle: CssStyle | null = cellStyleFn(rowId, colId);
      if (cellStyle) {
        for (const name of Object.keys(cellStyle)) {
          newStyle[name] = cellStyle[name];
        }
      }
      if (!newStyle['font-size.px']) {
        newStyle['font-size.px'] = this.getTextAreaFontSize();
      }
      if (!newStyle['font-family']) {
        newStyle['font-family'] = this.getTextAreaFontFamily();
      }
      return newStyle;
    });
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
      this.cellEditorListener().cellEditor.getCellRectangle();
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
    return this.cellEditorListener().cellEditor.getCellControl();
  }
}
