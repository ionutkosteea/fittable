import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  createCell,
  createCellCoord,
  createCellRange,
  createStyle,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { Operation, registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitCell, FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

type ButtonText = 'Cut cells B2, B3' | 'Paste over C2';

@Component({
  selector: 'cut-paste-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class CutPasteCellsComponent
  extends ConsoleTopic
  implements OnInit, OnDestroy
{
  public readonly title: TopicTitle = 'Cut / Paste cells';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cut-paste-cells-ts-01.jpg' },
    { image: 'cut-paste-cells-ts-02.jpg' },
  ];
  public buttonText: ButtonText = 'Cut cells B2, B3';
  public fit!: FittableDesigner;
  public consoleText = '';
  private subscription?: Subscription;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, columnHeader: true })
    );

    const table: FitTable = createTable<FitTable>(5, 5)
      .addStyle('s0', createStyle<FitStyle>().set('background-color', 'yellow'))
      .addCell(1, 1, createCell<FitCell>().setStyleName('s0').setValue('[1,1]'))
      .addCell(
        2,
        1,
        createCell<FitCell>().setStyleName('s0').setValue('[2,1]')
      );
    this.fit = createFittableDesigner(table);
    const afterRun$: Subject<Operation> = new Subject();
    this.subscription = afterRun$.subscribe((operation: Operation): void => {
      this.consoleText += 'Operation id: ' + operation.id + '\n';
    });
    this.fit.operationExecutor?.addListener({
      onAfterRun$: (): Subject<Operation> => afterRun$,
    });
  }

  public runOperation(): void {
    if (this.buttonText === 'Cut cells B2, B3') {
      this.runCut();
      this.buttonText = 'Paste over C2';
    } else if (this.buttonText === 'Paste over C2') {
      this.runPaste();
      this.buttonText = 'Cut cells B2, B3';
    }
  }

  private runCut(): void {
    const args: FitOperationDtoArgs = {
      id: 'cell-cut',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(2, 1)),
      ],
    };
    this.fit.operationExecutor?.run(args);
  }

  private runPaste(): void {
    const args: FitOperationDtoArgs = {
      id: 'cell-paste',
      selectedCells: [createCellRange(createCellCoord(1, 2))],
    };
    this.fit.operationExecutor?.run(args);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
