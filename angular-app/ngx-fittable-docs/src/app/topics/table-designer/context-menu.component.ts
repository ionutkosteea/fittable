import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  createFitViewModelConfig,
  FitContextMenuControlId,
} from 'fittable-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'context-menu',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ContextMenuComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Context menu';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'context-menu-ts.jpg' },
  ];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ cellSelection: true, contextMenu: true })
    );

    this.fit = createTableDesigner(createTable());

    this.removeClearMenuItem();
  }

  private removeClearMenuItem(): void {
    const clearControlId: FitContextMenuControlId = 'clear';
    this.fit.viewModel.contextMenu?.removeControl(clearControlId);
  }
}
