import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

import { CssStyle, CellRange, DataType } from 'fittable-core/model';
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

@Component({
  selector: 'fit-table-center',
  templateUrl: './table-center.component.html',
  styleUrls: ['../common/scss/table.scss', './table-center.component.scss'],
})
export class TableCenterComponent
  extends TableCommon
  implements OnInit, OnDestroy
{
  @Input({ required: true }) override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;
  @Output() onScroll$: EventEmitter<{ scrollLeft: number; scrollTop: number }> =
    new EventEmitter();
  cellEditorListener?: CellEditorListener;
  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  ngOnInit(): void {
    this.cellEditorListener = this.createCellEditorListener();
    this.subscriptions.add(this.openCellEditorContextMenu$());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription | undefined): void =>
      s?.unsubscribe()
    );
  }

  onScroll(event: Event): void {
    const scrollContainer: HTMLElement = event.target as HTMLElement;
    this.onScroll$.emit({
      scrollLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
    });
  }

  getScrollContainer(): ScrollContainer {
    return this.viewModel.tableScrollContainer;
  }

  getCellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel.cellSelection?.body;
  }

  getSelectedCells(): CellRange[] {
    return this.viewModel.cellSelection?.body.getRanges() ?? [];
  }

  getCellSelectionRectangles(): CssStyle[] {
    return this.viewModel.mobileLayout.bodySelectionRectangles;
  }

  getTableFontSize(): number {
    return getViewModelConfig().fontSize;
  }

  getTableFontFamily(): string | undefined {
    const fonts: Option[] | undefined = getViewModelConfig().fontFamily;
    return fonts ? fonts[0].value : undefined;
  }

  getDataTypeClass(
    rowId: number,
    colId: number
  ): ' fit-table-cell-align-center' | ' fit-table-cell-align-right' | '' {
    const cellType: DataType['name'] = //
      this.viewModel.tableViewer.getCellType(rowId, colId);
    if (cellType === 'number' || cellType === 'date-time') {
      return ' fit-table-cell-align-right';
    } else if (cellType === 'boolean') {
      return ' fit-table-cell-align-center';
    }
    return '';
  }

  private createCellEditorListener(): CellEditorListener | undefined {
    return (
      this.viewModel.cellEditor &&
      createCellEditorListener(
        this.viewModel.cellEditor,
        (): CellRange[] => this.viewModel.cellSelection?.body.getRanges() ?? []
      )
    );
  }

  private openCellEditorContextMenu$(): Subscription | undefined {
    return (
      this.viewModel.contextMenu &&
      this.cellEditorListener
        ?.onContextMenu$()
        .subscribe((event: FitMouseEvent): void => {
          this.viewModel.contextMenu &&
            createWindowListener(this.viewModel.contextMenu).onShow(event);
        })
    );
  }
}
