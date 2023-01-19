import { Component, Input, OnDestroy } from '@angular/core';

import {
  Container,
  TableViewer,
  TableScrollerListener,
  InputControlListener,
  Window,
  WindowListener,
  Statusbar,
  getViewModelConfig,
  ViewModel,
  HostListeners,
  FittableDesigner,
} from 'fit-core/view-model';

@Component({
  selector: 'fittable',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class TableViewComponent implements OnDestroy {
  @Input() designer!: FittableDesigner;

  public readonly getViewModel = (): ViewModel => this.designer.viewModel;

  public readonly getHostListeners = (): HostListeners =>
    this.designer.hostListeners;

  public hasToolbar(): boolean {
    return this.designer.viewModel.toolbar !== undefined;
  }

  public readonly getToolbar = (): Container =>
    this.designer.viewModel.toolbar as Container;

  public readonly getInputControlListener = ():
    | InputControlListener
    | undefined => this.designer.hostListeners.inputControlListener;

  public readonly getTableScrollerListener = (): TableScrollerListener =>
    this.designer.hostListeners.tableScrollerListener;

  public getTableWidth(): number {
    const tableViewer: TableViewer = this.designer.viewModel.tableViewer;
    return tableViewer.getRowHeaderWidth() + tableViewer.getBodyWidth();
  }

  public getTableHeight(): number {
    const tableViewer: TableViewer = this.designer.viewModel.tableViewer;
    return tableViewer.getColumnHeaderHeight() + tableViewer.getBodyHeight();
  }

  public hasContextMenu(): boolean {
    return (
      this.designer.viewModel.contextMenu !== undefined &&
      this.designer.hostListeners.windowListener !== undefined
    );
  }

  public readonly getContextMenu = (): Window =>
    this.designer.viewModel.contextMenu as Window;

  public readonly getWindowListener = (): WindowListener =>
    this.designer.hostListeners.windowListener as WindowListener;

  public hasStatusbar(): boolean {
    return this.designer.viewModel.statusbar !== undefined;
  }

  public readonly getStatusbar = (): Statusbar =>
    this.designer.viewModel.statusbar as Statusbar;

  public hasSettingsBar(): boolean {
    return (
      this.designer.viewModel.settingsBar !== undefined &&
      this.designer.hostListeners.windowListener !== undefined
    );
  }

  public readonly getSettingsBar = (): Container =>
    this.designer.viewModel.settingsBar as Container;

  public readonly showRowHeader = (): boolean =>
    getViewModelConfig().rowHeaderWidth ? true : false;

  public readonly showColumnHeader = (): boolean =>
    getViewModelConfig().columnHeaderHeight ? true : false;

  public ngOnDestroy(): void {
    this.designer.viewModel.destroy();
  }
}
