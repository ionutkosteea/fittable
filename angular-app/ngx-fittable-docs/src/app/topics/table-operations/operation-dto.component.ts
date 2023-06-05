import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createTable,
  registerModelConfig,
} from 'fittable-core/model';
import {
  OperationDto,
  registerOperationConfig,
} from 'fittable-core/operations';
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
  selector: 'operation-dto',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class OperationDtoComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Operation DTO';
  public readonly buttonText = 'Add value to cell B2';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'operation-dto-ts-01.jpg' },
      { image: 'operation-dto-ts-02.jpg' },
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

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'cell-value',
      selectedCells: [createCellRange(createCellCoord(1, 1))],
      value: 'Check console',
    };
    const operationDto: OperationDto = this.fit.operationExecutor //
      ?.createOperationDto(args) as OperationDto;
    this.consoleText = JSON.stringify(operationDto, null, 2);
    this.fit.operationExecutor?.runOperationDto(operationDto);
  }
}
