import { Component, OnInit } from '@angular/core';

import {
  DataType,
  createCellCoord,
  createCellRange,
  createDataType4Dto,
  createStyle4Dto,
  createTable,
  registerModelConfig,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitTable, FIT_MODEL_CONFIG } from 'fittable-model';
import {
  FitOperationArgs,
  FIT_OPERATION_CONFIG,
} from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'paint-format',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class PaintFormatComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Paint format';
  public readonly buttonText = 'Copy A1 style to B2:D4';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'paint-format-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'paint-format-ts-02.jpg' },
      { image: 'console-operation-ts-03.jpg' },
    ];
  }

  private styleName?: string;
  private dataType?: DataType;

  public override ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    const table: FitTable = createTable<FitTable>()
      .addStyle('s0', createStyle4Dto({ 'background-color': 'lightblue' }))
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 0, 1.23)
      .setCellDataType(0, 0, createDataType4Dto({ name: 'number', format: '0#.##0' }))
      .setCellValue(1, 1, 7);
    this.fit = createFittableDesigner(table);

    this.styleName = table.getCellStyleName(0, 0);
    this.dataType = table.getCellDataType(0, 0);

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'paint-format',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(3, 3)),
      ],
      styleName: this.styleName,
      dataType: this.dataType,
    };
    this.fit.operationExecutor?.run(args);
  }
}
