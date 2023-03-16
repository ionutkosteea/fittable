import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createStyle,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { OperationDto, registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'paint-format',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class PaintFormatComponent
  extends ConsoleTopic
  implements OnInit, OnDestroy
{
  public readonly title: TopicTitle = 'Paint format';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'paint-format-ts-01.jpg' },
    { image: 'paint-format-ts-02.jpg' },
    { image: 'paint-format-ts-03.jpg' },
  ];
  public readonly buttonText = 'Copy A1 style to B2:D4';
  public fit!: FittableDesigner;
  public consoleText = '';
  private subscription?: Subscription;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    this.fit = createFittableDesigner(
      createTable<FitTable>()
        .addStyle('s0', createStyle<FitStyle>().set('background-color', 'blue'))
        .setCellStyleName(0, 0, 's0')
    );

    this.subscription = this.writeToConsole$();
  }

  private writeToConsole$(): Subscription {
    return this.fit
      .operationExecutor!.onAfterRun$()
      .subscribe((operationDto: OperationDto): void => {
        this.consoleText = 'Operation id: ' + operationDto.id + '\n';
        this.consoleText +=
          'Operation steps: ' + JSON.stringify(operationDto.steps, null, 2);
      });
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
      id: 'style-name',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(3, 3)),
      ],
      styleName: 's0',
    };
    this.fit.operationExecutor?.run(args);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
