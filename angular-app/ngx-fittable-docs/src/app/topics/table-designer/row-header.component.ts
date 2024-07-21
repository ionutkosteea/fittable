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
  selector: 'row-header',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class RowHeaderComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Row header';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'row-header-ts.jpg' },
  ];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        rowHeaderWidth: 80, // default 40
        rowHeaderTextFn: (rowId: number): string => 'R' + (rowId + 1),
      })
    );

    this.fit = createTableDesigner(createTable());
  }
}
