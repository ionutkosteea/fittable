import { Component, OnInit } from '@angular/core';

import {
  createLineRange,
  createTable,
  registerModelConfig,
  Table,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
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
  selector: 'remove-rows',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class RemoveRowsComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Remove rows';
  public readonly buttonText = 'Remove rows 2, 3';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'remove-rows-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'remove-rows-ts-02.jpg' },
      { image: 'console-operation-ts-03.jpg' },
    ];
  }

  public override ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });
    this.fit = createFittableDesigner(table);

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'row-remove',
      selectedLines: [createLineRange(1, 2)],
    };
    this.fit.operationExecutor?.run(args);
  }
}
