import { Component, Input, OnDestroy } from '@angular/core';

import {
  Container,
  TableViewer,
  ViewModel,
  HostListeners,
  TableScrollerListener,
  InputControlListener,
  Window,
  WindowListener,
  Statusbar,
  getViewModelConfig,
} from 'fit-core/view-model';

@Component({
  selector: 'fit-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class TableViewComponent implements OnDestroy {
  @Input() viewModel!: ViewModel;
  @Input() hostListeners!: HostListeners;

  public hasToolbar(): boolean {
    return this.viewModel.toolbar !== undefined;
  }

  public readonly getToolbar = (): Container =>
    this.viewModel.toolbar as Container;

  public readonly getInputControlListener = ():
    | InputControlListener
    | undefined => this.hostListeners.inputControlListener;

  public readonly getTableScrollerListener = (): TableScrollerListener =>
    this.hostListeners.tableScrollerListener;

  public getTableWidth(): number {
    const tableViewer: TableViewer = this.viewModel.tableViewer;
    return tableViewer.getRowHeaderWidth() + tableViewer.getBodyWidth();
  }

  public getTableHeight(): number {
    const tableViewer: TableViewer = this.viewModel.tableViewer;
    return tableViewer.getColumnHeaderHeight() + tableViewer.getBodyHeight();
  }

  public hasContextMenu(): boolean {
    return (
      this.viewModel.contextMenu !== undefined &&
      this.hostListeners.windowListener !== undefined
    );
  }

  public readonly getContextMenu = (): Window =>
    this.viewModel.contextMenu as Window;

  public readonly getWindowListener = (): WindowListener =>
    this.hostListeners.windowListener as WindowListener;

  public hasStatusbar(): boolean {
    return this.viewModel.statusbar !== undefined;
  }

  public readonly getStatusbar = (): Statusbar =>
    this.viewModel.statusbar as Statusbar;

  public hasSettingsBar(): boolean {
    return (
      this.viewModel.settingsBar !== undefined &&
      this.hostListeners.windowListener !== undefined
    );
  }

  public readonly getSettingsBar = (): Container =>
    this.viewModel.settingsBar as Container;

  public readonly showRowHeader = (): boolean =>
    getViewModelConfig().showRowHeader ?? false;

  public readonly showColumnHeader = (): boolean =>
    getViewModelConfig().showColumnHeader ?? false;

  public ngOnDestroy(): void {
    this.viewModel.destroy();
  }
}
