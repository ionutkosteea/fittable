import { Component } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  FittableDesigner,
  ViewModel,
  ScrollContainer,
  Container,
  Window,
  Statusbar,
  registerViewModelConfig,
  createFittableDesigner,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';

import { TopicTitle } from '../../../common/topic-title.model';

@Component({
  selector: 'custom-view',
  templateUrl: './custom-view.component.html',
  styleUrls: ['./custom-view.component.css', '../../common/common.css'],
})
export class CustomViewComponent {
  public title: TopicTitle = 'Custom view';
  private fit: FittableDesigner;

  constructor() {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
    this.fit = createFittableDesigner(
      createTable().setCellValue(1, 1, 'Removable cell')
    );
  }

  public readonly getViewModel = (): ViewModel => this.fit.viewModel;
  public readonly getTableScrollContainer = (): ScrollContainer =>
    this.fit.viewModel.tableScrollContainer;
  public readonly hasToolbar = (): boolean =>
    this.fit.viewModel.toolbar !== undefined;
  public readonly getToolbar = (): Container =>
    this.fit.viewModel.toolbar as Container;
  public readonly hasContextMenu = (): boolean =>
    this.fit.viewModel.contextMenu !== undefined;
  public readonly getContextMenu = (): Window =>
    this.fit.viewModel.contextMenu as Window;
  public readonly hasStatusbar = (): boolean =>
    this.fit.viewModel.statusbar !== undefined;
  public readonly getStatusbar = (): Statusbar =>
    this.fit.viewModel.statusbar as Statusbar;
  public readonly hasSettingsBar = (): boolean =>
    this.fit.viewModel.settingsBar !== undefined;
  public readonly getSettingsBar = (): Container =>
    this.fit.viewModel.settingsBar as Container;

  public ngOnDestroy(): void {
    this.fit.viewModel.destroy();
  }
}
