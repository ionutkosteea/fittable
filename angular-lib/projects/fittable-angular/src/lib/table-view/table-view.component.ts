import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  Container,
  TableViewer,
  Window,
  Statusbar,
  getViewModelConfig,
  ViewModel,
  FittableDesigner,
  ScrollContainer,
  CellSelectionListener,
  createCellSelectionListener,
} from 'fittable-core/view-model';

@Component({
  selector: 'fittable',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class TableViewComponent implements OnInit, OnDestroy {
  @Input() designer!: FittableDesigner;

  public cellSelectionListener?: CellSelectionListener;

  public ngOnInit(): void {
    this.cellSelectionListener = this.createCellSelectionListener();
  }

  private createCellSelectionListener(): CellSelectionListener | undefined {
    const wm = this.getViewModel();
    return (
      wm.cellSelection &&
      createCellSelectionListener(wm.cellSelection, wm.cellSelectionScroller)
    );
  }

  public readonly getViewModel = (): ViewModel => this.designer.viewModel;

  public hasToolbar(): boolean {
    return this.designer.viewModel.toolbar !== undefined;
  }

  public readonly getToolbar = (): Container =>
    this.designer.viewModel.toolbar as Container;

  public readonly getTableScroller = (): ScrollContainer =>
    this.designer.viewModel.tableScroller;

  public getTableWidth(): number {
    const tableViewer: TableViewer = this.designer.viewModel.tableViewer;
    return tableViewer.getRowHeaderWidth() + tableViewer.getBodyWidth();
  }

  public getTableHeight(): number {
    const tableViewer: TableViewer = this.designer.viewModel.tableViewer;
    return tableViewer.getColHeaderHeight() + tableViewer.getBodyHeight();
  }

  public hasContextMenu(): boolean {
    return this.designer.viewModel.contextMenu !== undefined;
  }

  public readonly getContextMenu = (): Window =>
    this.designer.viewModel.contextMenu as Window;

  public hasStatusbar(): boolean {
    return this.designer.viewModel.statusbar !== undefined;
  }

  public readonly getStatusbar = (): Statusbar =>
    this.designer.viewModel.statusbar as Statusbar;

  public hasSettingsBar(): boolean {
    return this.designer.viewModel.settingsBar !== undefined;
  }

  public readonly getSettingsBar = (): Container =>
    this.designer.viewModel.settingsBar as Container;

  public readonly showRowHeader = (): boolean =>
    getViewModelConfig().rowHeaderWidth ? true : false;

  public readonly showColHeader = (): boolean =>
    getViewModelConfig().colHeaderHeight ? true : false;

  public ngOnDestroy(): void {
    this.designer.viewModel.destroy();
  }
}
