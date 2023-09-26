import { Component, OnInit } from '@angular/core';

import { createTable4Dto, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG, FitTableDto } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'cell-data-type',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellDataTypeComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Cell data-type';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-data-type-ts-01.jpg' },
    { image: 'cell-data-type-ts-02.jpg' },
  ];
  private readonly fitTableDto: FitTableDto = {
    numberOfRows: 5,
    numberOfCols: 5,
    cells: {
      0: {
        0: { value: 1000, dataType: { name: 'number', format: '#' } },
        1: { value: 1000, dataType: { name: 'number', format: '#.00' } },
        2: { value: 1000, dataType: { name: 'number', format: '#,#' } },
        3: { value: 1000, dataType: { name: 'number', format: '#,#.00' } },
        4: { value: 1000, dataType: { name: 'string' } },
      },
      1: {
        0: { value: 0.1, dataType: { name: 'number', format: '#%' } },
        1: { value: 0.1, dataType: { name: 'number', format: '#.00%' } },
        2: { value: 10, dataType: { name: 'number', format: '#,#%' } },
        3: { value: 10, dataType: { name: 'number', format: '#,#.00%' } },
      },
      2: {
        0: { value: 1000, dataType: { name: 'number', format: '$#' } },
        1: { value: 1000, dataType: { name: 'number', format: '$#.00' } },
        2: { value: 1000, dataType: { name: 'number', format: '$#,#' } },
        3: { value: 1000, dataType: { name: 'number', format: '$#,#.00' } },
      },
      3: {
        0: {
          value: '2013-12-31',
          dataType: { name: 'date-time', format: 'yyyy-MM-dd' },
        },
        1: {
          value: '2013-12-31',
          dataType: { name: 'date-time', format: 'dd.MM.yyyy' },
        },
        2: {
          value: '2013-12-31',
          dataType: { name: 'date-time', format: 'MM/dd/yyyy' },
        },
        3: {
          value: '23:30:59',
          dataType: { name: 'date-time', format: 'hh:mm:ss' },
        },
        4: {
          value: '2023-01-09 01:30',
          dataType: { name: 'date-time', format: 'y-M-d h:m' },
        },
      },
      4: {
        0: { value: 1000, dataType: { name: 'date-time', format: 'd.M.y' } },
      },
    },
  };
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        cellSelection: true,
        cellEditor: true,
        toolbar: true,
      })
    );

    this.fit = createFittableDesigner(createTable4Dto(this.fitTableDto));
  }
}
