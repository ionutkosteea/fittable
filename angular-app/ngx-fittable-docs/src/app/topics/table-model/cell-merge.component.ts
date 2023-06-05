import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitTable, FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'cell-merge',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellMergeComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Cell merge';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-merge-ts.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ cellSelection: true, contextMenu: true })
    );

    this.fit = createFittableDesigner(
      createTable<FitTable>() // FitTable default: 5 rows, 5 cols
        .setCellValue(1, 1, 'Merged cell text')
        .setRowSpan(1, 1, 2)
        .setColSpan(1, 1, 2)
    );
  }
}
