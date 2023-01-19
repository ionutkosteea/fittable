import { Component, OnInit } from '@angular/core';

import { createCell, createTable, registerModelConfig } from 'fit-core/model';
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
  selector: 'cell-value',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class CellValueComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Cell value';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-value-ts.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ cellEditor: true, toolbar: true })
    );

    const shortText = 'Short text';
    const longText = 'Long text spreads on multiple lines';
    const multipleLineText = 'Line1\nLine2\nLine3';
    this.fit = createFittableDesigner(
      createTable(5, 5)
        .addCell(1, 1, createCell().setValue(shortText))
        .addCell(2, 1, createCell().setValue(longText))
        .addCell(3, 1, createCell().setValue(multipleLineText))
    );
  }
}
