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
  FittableViewer,
} from 'fit-core/view-model';

@Component({
  selector: 'fittable',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class TableViewComponent implements OnDestroy {
  @Input() viewer!: FittableViewer;

  public readonly getViewModel = (): ViewModel => this.viewer.viewModel;

  public readonly getHostListeners = (): HostListeners =>
    this.viewer.hostListeners;

  public hasToolbar(): boolean {
    return this.viewer.viewModel.toolbar !== undefined;
  }

  public readonly getToolbar = (): Container =>
    this.viewer.viewModel.toolbar as Container;

  public readonly getInputControlListener = ():
    | InputControlListener
    | undefined => this.viewer.hostListeners.inputControlListener;

  public readonly getTableScrollerListener = (): TableScrollerListener =>
    this.viewer.hostListeners.tableScrollerListener;

  public getTableWidth(): number {
    const tableViewer: TableViewer = this.viewer.viewModel.tableViewer;
    return tableViewer.getRowHeaderWidth() + tableViewer.getBodyWidth();
  }

  public getTableHeight(): number {
    const tableViewer: TableViewer = this.viewer.viewModel.tableViewer;
    return tableViewer.getColumnHeaderHeight() + tableViewer.getBodyHeight();
  }

  public hasContextMenu(): boolean {
    return (
      this.viewer.viewModel.contextMenu !== undefined &&
      this.viewer.hostListeners.windowListener !== undefined
    );
  }

  public readonly getContextMenu = (): Window =>
    this.viewer.viewModel.contextMenu as Window;

  public readonly getWindowListener = (): WindowListener =>
    this.viewer.hostListeners.windowListener as WindowListener;

  public hasStatusbar(): boolean {
    return this.viewer.viewModel.statusbar !== undefined;
  }

  public readonly getStatusbar = (): Statusbar =>
    this.viewer.viewModel.statusbar as Statusbar;

  public hasSettingsBar(): boolean {
    return (
      this.viewer.viewModel.settingsBar !== undefined &&
      this.viewer.hostListeners.windowListener !== undefined
    );
  }

  public readonly getSettingsBar = (): Container =>
    this.viewer.viewModel.settingsBar as Container;

  public readonly showRowHeader = (): boolean =>
    getViewModelConfig().showRowHeader ?? false;

  public readonly showColumnHeader = (): boolean =>
    getViewModelConfig().showColumnHeader ?? false;

  public ngOnDestroy(): void {
    this.viewer.viewModel.destroy();
  }
}
