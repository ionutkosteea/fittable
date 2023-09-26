import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  Container,
  Control,
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  createFitViewModelConfig,
  FitControl,
  FitControlType,
  FitToolbarControlId,
} from 'fittable-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'toolbar',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
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

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols

    this.replaceUndoButton();
  }

  private replaceUndoButton(): void {
    const toolbar: Container | undefined = this.fit.viewModel.toolbar;
    if (!toolbar) throw new Error('Toolbar is not defined.');
    const undoControlType: FitControlType = 'button';
    const undoControlId: FitToolbarControlId = 'undo';
    const controlMap: Map<string, Control> = new Map();
    for (const id of toolbar.getControlIds()) {
      let control: Control;
      if (id === undoControlId) {
        control = new FitControl()
          .setType(undoControlType)
          // Usually labels should be accessed via the language dictionary.
          .setLabel((): string => 'Undo')
          // Usually images should be accessed via the image registry.
          .setIcon((): string => 'url(../../../assets/icons/undo-red.svg)')
          .setRun((): void => alert('No function added!'));
      } else {
        control = toolbar.getControl(id);
      }
      controlMap.set(id, control);
    }
    toolbar.setControls(controlMap);
  }
}
