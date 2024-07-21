import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createTable4Dto,
  registerModelConfig,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitTableDto, FIT_MODEL_CONFIG } from 'fittable-model';
import {
  FitOperationArgs,
  FIT_OPERATION_CONFIG,
} from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'clear-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ClearCellsComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Clear cells';
  public readonly buttonText = 'Clear cells B2, C2';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'clear-cells-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'clear-cells-ts-02.jpg' },
      { image: 'console-operation-ts-03.jpg' },
    ];
  }

  public override ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    const tableDto: FitTableDto = {
      numberOfRows: 5,
      numberOfCols: 5,
      styles: { s0: { 'background-color': 'yellow' } },
      cells: {
        1: {
          1: { styleName: 's0', value: '[1,1]' },
          2: { styleName: 's0', value: '[1,2]' },
        },
      },
    };
    this.fit = createTableDesigner(createTable4Dto(tableDto));

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'cell-value',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(1, 2)),
      ],
      value: undefined,
    };
    this.fit.operationExecutor?.run(args);
  }
}
