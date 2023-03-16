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

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'column-header',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class ColHeaderComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Column header';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'column-header-ts.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        colHeader: true,
        colHeaderHeight: 42, // default 21
        colHeaderTextFn: (colId: number) => 'C' + (colId + 1), // default increment letter
      })
    );

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols
  }
}
