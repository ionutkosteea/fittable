import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  CellSelectionListener,
  ScrollContainer,
  ViewModel,
  createCellSelectionListener,
  getViewModelConfig,
} from 'fittable-core/view-model';

import { TableTopComponent } from './table-top/table-top.component';
import { TableLeftComponent } from './table-left/table-left.component';

@Component({
  selector: 'fit-table',
  templateUrl: 'table.component.html',
})
export class TableComponent implements OnInit {
  @Input() viewModel!: ViewModel;
  @ViewChild('tableTopComponent') tableTopComponent?: TableTopComponent;
  @ViewChild('tableLeftComponent') tableLeftComponent?: TableLeftComponent;

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

  public onScroll(div: { scrollLeft: number; scrollTop: number }): void {
    this.tableTopComponent?.scrollerRef?.nativeElement //
      .scrollTo(div.scrollLeft, 0);
    this.tableLeftComponent?.scrollerRef?.nativeElement //
      .scrollTo(0, div.scrollTop);
  }

  public readonly getColHeaderHeight = (): number =>
    this.viewModel.tableViewer.getColHeaderHeight();

  public readonly getRowHeaderWidth = (): number =>
    this.viewModel.tableViewer.getRowHeaderWidth();

  public readonly getTableScrollContainer = (): ScrollContainer =>
    this.viewModel.tableScrollContainer;

  public readonly getTableBodyWidth = (): number =>
    this.viewModel.tableViewer.getBodyWidth();

  public readonly getTableBodyHeight = (): number =>
    this.viewModel.tableViewer.getBodyHeight();

  public readonly hasRowHeader = (): boolean =>
    getViewModelConfig().rowHeaderWidth ? true : false;

  public readonly hasColHeader = (): boolean =>
    getViewModelConfig().colHeaderHeight ? true : false;

  public readonly getBodyOffset = (): CssStyle =>
    this.viewModel.mobileLayout.bodyOffset;

  public readonly getRowHeaderOffset = (): CssStyle =>
    this.viewModel.mobileLayout.rowHeaderOffset;

  public readonly getColHeaderOffset = (): CssStyle =>
    this.viewModel.mobileLayout.colHeaderOffset;
}
