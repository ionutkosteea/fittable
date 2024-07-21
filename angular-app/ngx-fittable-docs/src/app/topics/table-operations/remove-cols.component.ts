import { Component, OnInit } from '@angular/core';

import {
  createLineRange,
  createTable,
  registerModelConfig,
  Table,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import {
  FitOperationArgs,
  FIT_OPERATION_CONFIG,
} from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'remove-columns',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class RemoveColsComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Remove columns';
  public readonly buttonText = 'Remove columns B, C';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'on-init-table-values-ts.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'remove-cols-ts.jpg' },
      { image: 'console-operation-ts-03.jpg' },
    ];
  }

  public override ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });

    this.fit = createTableDesigner(table);

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'column-remove',
      selectedLines: [createLineRange(1, 2)],
    };
    this.fit.operationExecutor?.run(args);
  }
}
