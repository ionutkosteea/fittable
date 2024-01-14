import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  CellSelectionListener,
  ScrollContainer,
  ViewModel,
  createCellSelectionListener,
  getViewModelConfig,
} from 'fittable-core/view-model';

import { TableLeftTopCornerComponent } from './table-left-top-corner/table-left-top-corner.component';
import { TableTopComponent } from './table-top/table-top.component';
import { TableLeftComponent } from './table-left/table-left.component';
import { TableCenterComponent } from './table-center/table-center.component';

@Component({
  selector: 'fit-table',
  standalone: true,
  imports: [
    TableLeftTopCornerComponent,
    TableTopComponent,
    TableLeftComponent,
    TableCenterComponent,
  ],
  templateUrl: 'table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @Input({ required: true }) viewModel!: ViewModel;
  @ViewChild('tableTopComponent') tableTopComponent?: TableTopComponent;
  @ViewChild('tableLeftComponent') tableLeftComponent?: TableLeftComponent;
  cellSelectionListener?: CellSelectionListener;

  ngOnInit(): void {
    this.cellSelectionListener = this.createCellSelectionListener();
  }

  onScroll(div: { scrollLeft: number; scrollTop: number }): void {
    this.tableTopComponent?.scrollerRef?.nativeElement //
      .scrollTo(div.scrollLeft, 0);
    this.tableLeftComponent?.scrollerRef?.nativeElement //
      .scrollTo(0, div.scrollTop);
  }

  getColHeaderHeight(): number {
    return this.viewModel.tableViewer.getColHeaderHeight();
  }

  getRowHeaderWidth(): number {
    return this.viewModel.tableViewer.getRowHeaderWidth();
  }

  getTableScrollContainer(): ScrollContainer {
    return this.viewModel.tableScrollContainer;
  }

  getTableBodyWidth(): number {
    return this.viewModel.tableViewer.getBodyWidth();
  }

  getTableBodyHeight(): number {
    return this.viewModel.tableViewer.getBodyHeight();
  }

  hasRowHeader(): boolean {
    return getViewModelConfig().rowHeaderWidth ? true : false;
  }

  hasColHeader(): boolean {
    return getViewModelConfig().colHeaderHeight ? true : false;
  }

  getBodyOffset(): CssStyle {
    return this.viewModel.mobileLayout.bodyOffset;
  }

  getRowHeaderOffset(): CssStyle {
    return this.viewModel.mobileLayout.rowHeaderOffset;
  }

  getColHeaderOffset(): CssStyle {
    return this.viewModel.mobileLayout.colHeaderOffset;
  }

  private createCellSelectionListener(): CellSelectionListener | undefined {
    const wm: ViewModel = this.viewModel;
    return (
      wm.cellSelection &&
      createCellSelectionListener(wm.cellSelection, wm.cellSelectionScroller)
    );
  }
}
