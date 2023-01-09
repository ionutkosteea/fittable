import { Component, Input } from '@angular/core';

import {
  CssStyle,
  createCellCoord,
  CellRange,
  CellCoord,
  Style,
} from 'fit-core/model';
import {
  ViewModel,
  Rectangle,
  HostListeners,
  CellEditorListener,
  CellSelectionRanges,
  CellEditor,
} from 'fit-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-center',
  templateUrl: './table-center.component.html',
  styleUrls: ['../common/css/table-common.css', './table-center.component.css'],
})
export class TableCenterComponent extends TableCommon {
  @Input() viewModel!: ViewModel;
  @Input() hostListeners!: HostListeners;

  public getContainerPosition(): CssStyle {
    const left: number = this.getRowHeaderWidth() + this.getOffsetX();
    const top: number = this.getColumnHeaderHeight() + this.getOffsetY();
    return { transform: 'translate3d(' + left + 'px,' + top + 'px,0px)' };
  }

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.body;

  public getCellSelectionStyle(): CssStyle[] {
    const styles: CssStyle[] = [];
    this.viewModel.cellSelectionPainter?.body
      .getRectangles()
      .forEach((rect: Rectangle): void => {
        styles.push({
          'left.px': rect.left - 2,
          'top.px': rect.top - 2,
          'width.px': rect.width,
          'height.px': rect.height,
        });
      });
    return styles;
  }

  public hasCellEditor(): boolean {
    return this.hostListeners.cellEditorListener?.getCellEditor() !== undefined;
  }

  public readonly getCellEditor = (): CellEditor =>
    this.viewModel.cellEditor as CellEditor;

  public readonly getSelectedCells = (): CellRange[] =>
    this.viewModel.cellSelection?.body.getRanges() ?? [];

  public readonly showCellEditor = (
    rowId: number,
    colId: number,
    event: MouseEvent
  ): void =>
    this.getCellEditorListener()?.onShow(createCellCoord(rowId, colId), event);

  public readonly getCellEditorListener = (): CellEditorListener =>
    this.hostListeners.cellEditorListener as CellEditorListener;

  public getCellEditorStyle(): Style | undefined {
    const cellCoord: CellCoord = this.getCellEditor().getCell();
    return this.viewModel.tableViewer.getCellStyle(
      cellCoord.getRowId(),
      cellCoord.getColId()
    );
  }
}
