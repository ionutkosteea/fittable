import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  Container,
  ContextMenuFactory,
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
  ToolbarFactory,
  ViewModelConfig,
  Window,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { FitContainer, FitWindow, FIT_VIEW_MODEL_CONFIG } from 'fit-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'custom-view-model',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class CustomViewModelComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Custom view model';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'custom-view-model-ts.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    const viewModelConfig: ViewModelConfig = { ...FIT_VIEW_MODEL_CONFIG };
    viewModelConfig.toolbarFactory = this.createDummyToolbarFactory();
    viewModelConfig.contextMenuFactory = this.createDummyContextMenuFactory();
    registerViewModelConfig(viewModelConfig);

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols
  }

  private createDummyToolbarFactory(): ToolbarFactory {
    return { createToolbar: (): Container => new FitContainer() };
  }

  private createDummyContextMenuFactory(): ContextMenuFactory {
    return { createContextMenu: (): Window => new FitWindow() };
  }
}
