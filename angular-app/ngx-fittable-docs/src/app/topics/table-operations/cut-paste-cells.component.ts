import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createStyle,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

type ButtonText = 'Cut cells B2, B3' | 'Paste over C2';

@Component({
  selector: 'cut-paste-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class CutPasteCellsComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Cut / Paste cells';
  public buttonText: ButtonText = 'Cut cells B2, B3';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'cut-paste-cells-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'cut-paste-cells-ts-02.jpg' },
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
      .addStyle('s0', createStyle<FitStyle>().set('background-color', 'yellow'))
      .setCellValue(1, 1, '[1,1]')
      .setCellStyleName(1, 1, 's0')
      .setCellValue(2, 1, '[2,1]')
      .setCellStyleName(2, 1, 's0');
    this.fit = createFittableDesigner(table);

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
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
}
