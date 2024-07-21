import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig, Table } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  createFitViewModelConfig,
  FitUIOperationArgs,
} from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';

import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'column-filters',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ColFiltersComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Column filters (1/2)';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'column-filters-ts-01.jpg' },
    { image: 'column-filters-ts-02.jpg' },
    { image: 'column-filters-ts-03.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        cellSelection: true,
        colFilters: true,
        toolbar: true,
        cellEditor: true,
        statusbar: true,
      })
    );

    const table: Table = createTable()
      .setNumberOfRows(1000)
      .setNumberOfCols(10);
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });

    this.fit = createTableDesigner(table);

    this.buttons.push(this.createFilterButton());
  }

  private createFilterButton(): Button {
    return {
      getLabel: (): string =>
        'Filter column A: include [100,0], [200,0], [300,0]',
      run: (): void => {
        const colId = 0;
        const args: FitUIOperationArgs = {
          id: 'column-filter',
          changes: {
            id: 'column-filter',
            colId,
            valueCondition: {
              mode: 'Clear',
              values: ['[100,0]', '[200,0]', '[300,0]'],
            },
          },
          undoChanges: {
            id: 'column-filter',
            colId,
            valueCondition:
              this.fit.viewModel.colFilters?.getValueConditions()[colId],
          },
        };
        this.fit.operationExecutor?.run(args);
      },
    };
  }

  public getConsoleText(): string {
    return JSON.stringify(
      this.fit.viewModel.colFilters?.getValueConditions(),
      null,
      2
    );
  }
}
