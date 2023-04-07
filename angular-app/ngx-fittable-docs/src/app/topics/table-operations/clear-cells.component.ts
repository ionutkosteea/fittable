import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createTable4Dto,
  registerModelConfig,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTableDto, FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'clear-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
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
    // The register functions should be called, in most cases, from the Angular main module.
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
    this.fit = createFittableDesigner(createTable4Dto(tableDto));

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
      id: 'cell-value',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(1, 2)),
      ],
      value: undefined,
    };
    this.fit.operationExecutor?.run(args);
  }
}
