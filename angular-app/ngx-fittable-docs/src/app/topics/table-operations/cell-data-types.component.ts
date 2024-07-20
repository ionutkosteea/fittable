import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createDataType,
  createTable,
  registerModelConfig,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG, FitTable } from 'fittable-model';
import {
  FIT_OPERATION_CONFIG,
  FitOperationArgs,
} from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'cell-data-types',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellDataTypesComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Cell data-types';
  public readonly buttonText = 'Add data-types to cells B2, C2';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'cell-data-types-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'cell-data-types-ts-02.jpg' },
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

    const table: FitTable = createTable<FitTable>()
      .setCellValue(1, 1, 1000)
      .setCellValue(1, 2, 1000.123);
    this.fit = createFittableDesigner(table);

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'cell-data-type',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(1, 2)),
      ],
      dataType: createDataType('number', '$ #,#.00')
    };
    this.fit.operationExecutor?.run(args);
  }
}
