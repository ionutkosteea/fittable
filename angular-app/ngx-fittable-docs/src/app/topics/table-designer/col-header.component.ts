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
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'column-header',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ColHeaderComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Column header';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'column-header-ts.jpg' },
  ];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        colHeader: true,
        colHeaderHeight: 42, // default 21
        colHeaderTextFn: (colId: number) => 'C' + (colId + 1), // default increment letter
      })
    );

    this.fit = createTableDesigner(createTable());
  }
}
