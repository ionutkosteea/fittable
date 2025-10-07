import { Component, OnDestroy, input } from '@angular/core';

import {
  Container,
  Window,
  Statusbar,
  ViewModel,
  TableDesigner,
  OperationDialog,
} from 'fittable-core/view-model';

import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { TableComponent } from './table-view/table.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';
import { OperationDialogComponent } from './controls-view/operation-dialog/operation-dialog.component';

@Component({
  selector: 'fittable',
  standalone: true,
  imports: [
    ToolbarComponent,
    TableComponent,
    StatusbarComponent,
    SettingsBarComponent,
    ContextMenuComponent,
    OperationDialogComponent
  ],
  templateUrl: './fittable.component.html',
  styleUrls: ['./fittable.component.scss'],
})
export class FittableComponent implements OnDestroy {
  designer = input.required<TableDesigner>();

  get viewModel(): ViewModel {
    return this.designer().viewModel;
  }

  get toolbar(): Container | undefined {
    return this.viewModel.toolbar;
  }

  get contextMenu(): Window | undefined {
    return this.viewModel.contextMenu;
  }

  get statusbar(): Statusbar | undefined {
    return this.viewModel.statusbar;
  }

  get settingsBar(): Container | undefined {
    return this.viewModel.settingsBar;
  }

  get rowResizeDialog(): OperationDialog | undefined {
    return this.viewModel.rowResizeDialog;
  }

  get rowInsertAboveDialog(): OperationDialog | undefined {
    return this.viewModel.rowInsertAboveDialog;
  }

  get rowInsertBelowDialog(): OperationDialog | undefined {
    return this.viewModel.rowInsertBelowDialog;
  }

  get colResizeDialog(): OperationDialog | undefined {
    return this.viewModel.colResizeDialog;
  }

  get colInsertLeftDialog(): OperationDialog | undefined {
    return this.viewModel.colInsertLeftDialog;
  }

  get colInsertRightDialog(): OperationDialog | undefined {
    return this.viewModel.colInsertRightDialog;
  }

  ngOnDestroy(): void {
    this.viewModel.destroy();
  }
}
