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

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'cell-value',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellValueComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Cell value';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-value-ts.jpg' },
  ];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ cellEditor: true, toolbar: true })
    );

    this.fit = createTableDesigner(
      createTable()
        .setCellValue(1, 1, 'Short text')
        .setCellValue(2, 1, 'Long text spreads on multiple lines')
        .setCellValue(3, 1, 'Line1\nLine2\nLine3')
        .setCellValue(1, 2, 1000)
        .setCellValue(2, 2, 1000.123)
        .setCellValue(1, 3, true)
        .setCellValue(2, 3, false)
    );
  }
}
