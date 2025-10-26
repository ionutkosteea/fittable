import { Component, OnDestroy, input } from '@angular/core';
import { NgIf } from '@angular/common';

import {
  Container,
  Window,
  Statusbar,
  ViewModel,
  TableDesigner,
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

  ngOnDestroy(): void {
    this.viewModel.destroy();
  }
}
