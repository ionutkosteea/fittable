import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  Container,
  Control,
  createTableDesigner,
  TableDesigner,
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
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ toolbar: true, cellEditor: true }),
    );

    this.fit = createTableDesigner(createTable());

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
          .setLabel((): string => 'Undo')
          .setIcon(
            (): string => `
<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.904 16C12.681 12.781 12.98 7.87 6 8.034V12L0 6L6 0V3.881C14.359 3.663 15.29
  11.259 10.904 16Z" fill="#FF0000"/>
</svg>`,
          )
          .setRun((): void => alert('No function added!'));
      } else {
        control = toolbar.getControl(id);
      }
      controlMap.set(id, control);
    }
    toolbar.setControls(controlMap);
  }
}
