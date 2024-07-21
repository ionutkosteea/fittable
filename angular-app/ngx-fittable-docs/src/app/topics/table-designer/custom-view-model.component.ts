import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  Container,
  ContextMenuFactory,
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
  ToolbarFactory,
  ViewModelConfig,
  Window,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  FitContainer,
  FitWindow,
  FIT_VIEW_MODEL_CONFIG,
} from 'fittable-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'custom-view-model',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CustomViewModelComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Custom view model';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'custom-view-model-ts.jpg' },
  ];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    const viewModelConfig: ViewModelConfig = { ...FIT_VIEW_MODEL_CONFIG };
    viewModelConfig.toolbarFactory = this.createDummyToolbarFactory();
    viewModelConfig.contextMenuFactory = this.createDummyContextMenuFactory();
    registerViewModelConfig(viewModelConfig);

    this.fit = createTableDesigner(createTable());
  }

  private createDummyToolbarFactory(): ToolbarFactory {
    return { createToolbar: (): Container => new FitContainer() };
  }

  private createDummyContextMenuFactory(): ContextMenuFactory {
    return { createContextMenu: (): Window => new FitWindow() };
  }
}
