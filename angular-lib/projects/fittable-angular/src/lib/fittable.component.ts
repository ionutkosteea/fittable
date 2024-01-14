import { Component, Input, OnDestroy } from '@angular/core';

import {
  Container,
  Window,
  Statusbar,
  ViewModel,
  FittableDesigner,
  ScrollContainer,
} from 'fittable-core/view-model';

@Component({
  selector: 'fittable',
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
