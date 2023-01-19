import { Component, OnInit } from '@angular/core';

import {
  createCell,
  createCellCoord,
  createMergedRegions,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import {
  FitCell,
  FitMergedRegions,
  FitTable,
  FIT_MODEL_CONFIG,
} from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'cell-merge',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
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
      createTable<FitTable>(5, 5)
        .addCell(1, 1, createCell<FitCell>().setValue('Merged cell text'))
        .setMergedRegions(
          createMergedRegions<FitMergedRegions>() //
            .addRegion(createCellCoord(1, 1), createCellCoord(2, 2))
        )
    );
  }
}
