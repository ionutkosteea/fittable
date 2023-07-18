import { Component, Input, OnInit } from '@angular/core';

import {
  CellSelectionListener,
  ScrollContainer,
  TableViewer,
  ViewModel,
  createCellSelectionListener,
  getViewModelConfig,
} from 'fittable-core/view-model';

@Component({
  selector: 'fit-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() viewModel!: ViewModel;

  public cellSelectionListener?: CellSelectionListener;

  public ngOnInit(): void {
    this.cellSelectionListener = this.createCellSelectionListener();
  }

  private createCellSelectionListener(): CellSelectionListener | undefined {
    const wm: ViewModel = this.viewModel;
    return (
      wm.cellSelection &&
      createCellSelectionListener(wm.cellSelection, wm.cellSelectionScroller)
    );
  }

  public readonly getTableScrollContainer = (): ScrollContainer =>
    this.viewModel.tableScrollContainer;

  public getTableWidth(): number {
    const tableViewer: TableViewer = this.viewModel.tableViewer;
    return tableViewer.getRowHeaderWidth() + tableViewer.getBodyWidth();
  }

  public getTableHeight(): number {
    const tableViewer: TableViewer = this.viewModel.tableViewer;
    return tableViewer.getColHeaderHeight() + tableViewer.getBodyHeight();
  }

  public readonly showRowHeader = (): boolean =>
    getViewModelConfig().rowHeaderWidth ? true : false;

  public readonly showColHeader = (): boolean =>
    getViewModelConfig().colHeaderHeight ? true : false;
}
