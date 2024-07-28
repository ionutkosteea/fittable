import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CssStyle, CellRange, DataTypeName } from 'fittable-core/model';
import {
  ViewModel,
  CellEditorListener,
  createCellEditorListener,
  CellSelectionRanges,
  FitMouseEvent,
  createWindowListener,
  CellSelectionListener,
  getViewModelConfig,
  Option,
  ScrollContainer,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';
import { ScrollContainerDirective } from '../../controls-view/common/scroll-container.directive';
import { CellEditorComponent } from '../../controls-view/cell-editor/cell-editor.component';
import { CellEditorOpenDirective } from '../../controls-view/cell-editor/cell-editor.directive';
import { CellSelectionDirective } from '../common/cell-selection.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fit-table-center',
  standalone: true,
  imports: [
    CommonModule,
    ScrollContainerDirective,
    CellSelectionDirective,
    CellEditorOpenDirective,
    CellEditorComponent,
  ],
  templateUrl: './table-center.component.html',
  styleUrls: ['../common/scss/table.scss', './table-center.component.scss'],
})
export class TableCenterComponent extends TableCommon implements OnInit {
  override viewModel = input.required<ViewModel>();
  cellSelectionListener = input<CellSelectionListener>();
  onScroll$ = output<{ scrollLeft: number; scrollTop: number }>();

  protected readonly cellEditorListener = signal<CellEditorListener | undefined>(undefined);
  private readonly destroyRef = inject(DestroyRef);

  get scrollContainer(): ScrollContainer {
    return this.viewModel().tableScrollContainer;
  }

  get cellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel().cellSelection?.body;
  }

  get selectedCells(): CellRange[] | undefined {
    return this.viewModel().cellSelection?.body.getRanges();
  }

  get cellSelectionRectangles(): CssStyle[] {
    return this.viewModel().mobileLayout.bodySelectionRectangles;
  }

  get tableFontSize(): number {
    return getViewModelConfig().fontSize;
  }

  ngOnInit(): void {
    this.cellEditorListener.set(this.createCellEditorListener());
    this.openCellEditorContextMenu();
  }

  onScroll(event: Event): void {
    const scrollContainer: HTMLElement = event.target as HTMLElement;
    this.onScroll$.emit({
      scrollLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
    });
  }

  getTableFontFamily(): string | undefined {
    const fonts: Option[] | undefined = getViewModelConfig().fontFamily;
    return fonts ? fonts[0].value : undefined;
  }

  getDataTypeClass(
    rowId: number,
    colId: number
  ): ' cell-align-center' | ' cell-align-right' | '' {
    const cellType: DataTypeName = this.viewModel().tableViewer.getCellType(rowId, colId);
    if (cellType === 'number' || cellType === 'date-time') {
      return ' cell-align-right';
    } else if (cellType === 'boolean') {
      return ' cell-align-center';
    }
    return '';
  }

  private createCellEditorListener(): CellEditorListener | undefined {
    const cellEditor = this.viewModel().cellEditor;
    return cellEditor && createCellEditorListener(cellEditor, (): CellRange[] => this.viewModel().cellSelection?.body.getRanges() ?? []);
  }

  private openCellEditorContextMenu(): void {
    const contextMenu = this.viewModel().contextMenu;
    contextMenu &&
      this.cellEditorListener()
        ?.onContextMenu$()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: FitMouseEvent): void => {
          createWindowListener(contextMenu).onShow(event);
        })
  }
}
