import { Component, OnInit } from '@angular/core';

import {
  ColFilterExecutor,
  createColFilterExecutor,
  createTable,
  registerModelConfig,
  Table,
  Value,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitTable, FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'column-filter-executor',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ColFilterExecutorComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Column filters (2/2)';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'column-filter-executor-ts-01.jpg' },
    { image: 'column-filter-executor-ts-02.jpg' },
    { image: 'column-filter-executor-ts-03.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;
  private filterExecutor!: ColFilterExecutor;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        statusbar: true,
      })
    );

    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(1000)
      .setNumberOfCols(10);
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });

    this.fit = createTableDesigner(table);

    this.filterExecutor = createColFilterExecutor(table);
    this.buttons.push(this.createFilterButton());
    this.buttons.push(this.createClearFilterButton());
  }

  private createFilterButton(): Button {
    return {
      getLabel: (): string => 'Filter column A: keep values including "00"',
      run: (): void => {
        const table: Table | undefined = this.filterExecutor
          .addCondition(0, this.getFilterCondition)
          .run()
          .getFilteredTable();
        table && this.fit.viewModel.loadTable(table);
      },
    };
  }

  private readonly getFilterCondition = (
    rowId: number,
    colId: number,
    value?: Value
  ): boolean => (value ? value.toString().includes('00') : false);

  private createClearFilterButton(): Button {
    return {
      getLabel: (): string => 'Clear filter',
      run: (): void => {
        this.filterExecutor.clearConditions().run();
        this.fit.viewModel.loadTable(this.filterExecutor.table);
      },
    };
  }

  public getConsoleText(): string {
    const table: Table =
      this.filterExecutor.getFilteredTable() ?? this.filterExecutor.table;
    return 'Table number of rows: ' + table.getNumberOfRows();
  }
}
