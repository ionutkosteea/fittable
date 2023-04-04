import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { OperationDto, registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'operation-dto',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class OperationDtoComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Operation DTO';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'operation-dto-ts-01.jpg' },
    { image: 'operation-dto-ts-02.jpg' },
  ];
  public readonly buttonText = 'Add value to cell B2';
  public fit!: FittableDesigner;
  public consoleText = '';

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
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
