import { Component, OnInit } from '@angular/core';

import { createDataType, createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG, FitDataType, FitTable } from 'fittable-model';
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
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        cellSelection: true,
        cellEditor: true,
        toolbar: true,
      })
    );

    this.fit = this.createTableDesigner();
  }

  private createTableDesigner(): TableDesigner {
    return createTableDesigner(createTable<FitTable>()
      // Number
      .setCellValue(0, 0, 1000)
      .setCellDataType(0, 0, createDataType<FitDataType>('number', '#'))
      .setCellValue(0, 1, 1000)
      .setCellDataType(0, 1, createDataType<FitDataType>('number', '#.00'))
      .setCellValue(0, 2, 1000)
      .setCellDataType(0, 2, createDataType<FitDataType>('number', '#,#'))
      .setCellValue(0, 3, 1000)
      .setCellDataType(0, 3, createDataType<FitDataType>('number', '#,#.00'))
      .setCellValue(0, 4, 1000)
      .setCellDataType(0, 4, createDataType<FitDataType>('string'))
      // Percent
      .setCellValue(1, 0, 0.1)
      .setCellDataType(1, 0, createDataType<FitDataType>('number', '#%'))
      .setCellValue(1, 1, 0.1)
      .setCellDataType(1, 1, createDataType<FitDataType>('number', '#.00%'))
      .setCellValue(1, 2, 10)
      .setCellDataType(1, 2, createDataType<FitDataType>('number', '#,#%'))
      .setCellValue(1, 3, 10)
      .setCellDataType(1, 3, createDataType<FitDataType>('number', '#,#.00%'))
      // Currency
      .setCellValue(2, 0, 1000)
      .setCellDataType(2, 0, createDataType<FitDataType>('number', '$#'))
      .setCellValue(2, 1, 1000)
      .setCellDataType(2, 1, createDataType<FitDataType>('number', '$#.00'))
      .setCellValue(2, 2, 1000)
      .setCellDataType(2, 2, createDataType<FitDataType>('number', '$#,#'))
      .setCellValue(2, 3, 1000)
      .setCellDataType(2, 3, createDataType<FitDataType>('number', '$#,#.00'))
      // Date-time
      .setCellValue(3, 0, '2013-12-31')
      .setCellDataType(3, 0, createDataType<FitDataType>('date-time', 'yyyy-MM-dd'))
      .setCellValue(3, 1, '2013-12-31')
      .setCellDataType(3, 1, createDataType<FitDataType>('date-time', 'dd.MM.yyyy'))
      .setCellValue(3, 2, '2013-12-31')
      .setCellDataType(3, 2, createDataType<FitDataType>('date-time', 'MM/dd/yyyy'))
      .setCellValue(3, 3, '23:30:59')
      .setCellDataType(3, 3, createDataType<FitDataType>('date-time', 'hh:mm:ss'))
      .setCellValue(3, 4, '2023-01-09 01:30')
      .setCellDataType(3, 4, createDataType<FitDataType>('date-time', 'y-M-d h:m'))
      // Error
      .setCellValue(4, 0, 1000)
      .setCellDataType(4, 0, createDataType<FitDataType>('date-time', 'd.M.y'))
    );
  }
}
