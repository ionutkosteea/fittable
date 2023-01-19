import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  Container,
  ControlMap,
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import {
  createFitViewModelConfig,
  FitControl,
  FitControlType,
  FitToolbarControlId,
} from 'fit-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'toolbar',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class ToolbarComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Toolbar';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'toolbar-ts-01.jpg' },
    { image: 'toolbar-ts-02.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ toolbar: true, cellEditor: true })
    );

    this.fit = createFittableDesigner(createTable(5, 5));

    this.replaceUndoButton();
  }

  private replaceUndoButton(): void {
    const toolbar: Container = this.fit.viewModel.toolbar!;
    const undoControlType: FitControlType = 'push-button';
    const undoControlId: FitToolbarControlId = 'undo';
    const controlMap: ControlMap = {};
    for (const id of toolbar.getControlIds()) {
      if (id === undoControlId) {
        controlMap[id] = new FitControl()
          .setType(undoControlType)
          // Usually labels should be accessed via the language dictionary.
          .setLabel((): string => 'Undo')
          // Usually images should be accessed via the image registry.
          .setIcon((): string => 'url(../../../assets/icons/undo-red.svg)')
          .setRun((): void => alert('No function added!'));
      } else {
        controlMap[id] = toolbar.getControl(id);
      }
    }
    toolbar.setControls(controlMap);
  }
}
