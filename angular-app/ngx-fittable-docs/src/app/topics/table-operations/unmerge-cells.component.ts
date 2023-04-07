import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTable, FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'unmerge-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class UnmergeCellsComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Unmerge cells';
  public readonly buttonText = 'Unmerge cells B2:C3';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'unmerge-cells-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'unmerge-cells-ts-02.jpg' },
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

    this.fit = createFittableDesigner(
      createTable<FitTable>().setRowSpan(1, 1, 2).setColSpan(1, 1, 2)
    );

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
      id: 'cell-unmerge',
      selectedCells: [createCellRange(createCellCoord(1, 1))],
    };
    this.fit.operationExecutor?.run(args);
  }
}
