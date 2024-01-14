import { Component, Input, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';

import {
  Container,
  Window,
  Statusbar,
  ViewModel,
  FittableDesigner,
  ScrollContainer,
} from 'fittable-core/view-model';

import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { TableComponent } from './table-view/table.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';

@Component({
  selector: 'fittable',
  standalone: true,
  imports: [
    NgIf,
    ToolbarComponent,
    TableComponent,
    StatusbarComponent,
    SettingsBarComponent,
    ContextMenuComponent,
  ],
  templateUrl: './fittable.component.html',
  styleUrls: ['./fittable.component.scss'],
})
export class FittableComponent implements OnDestroy {
  @Input({ required: true }) designer!: FittableDesigner;

  ngOnDestroy(): void {
    this.designer.viewModel.destroy();
  }

  getViewModel(): ViewModel {
    return this.designer.viewModel;
  }

  getTableScrollContainer(): ScrollContainer {
    return this.designer.viewModel.tableScrollContainer;
  }

  hasToolbar(): boolean {
    return this.designer.viewModel.toolbar !== undefined;
  }

  getToolbar(): Container {
    return this.designer.viewModel.toolbar as Container;
  }

  hasContextMenu(): boolean {
    return this.designer.viewModel.contextMenu !== undefined;
  }

  getContextMenu(): Window {
    return this.designer.viewModel.contextMenu as Window;
  }

  hasStatusbar(): boolean {
    return this.designer.viewModel.statusbar !== undefined;
  }

  getStatusbar(): Statusbar {
    return this.designer.viewModel.statusbar as Statusbar;
  }

  hasSettingsBar(): boolean {
    return this.designer.viewModel.settingsBar !== undefined;
  }

  getSettingsBar(): Container {
    return this.designer.viewModel.settingsBar as Container;
  }
}
