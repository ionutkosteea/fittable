import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'statusbar',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class StatusbarComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Statusbar';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'statusbar-ts.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(createFitViewModelConfig({ statusbar: true }));

    this.fit = createFittableDesigner(createTable());

    this.changeText();
  }

  private changeText(): void {
    this.fit.viewModel.statusbar!.getText = (): string =>
      'New statusbar text...';
  }
}
