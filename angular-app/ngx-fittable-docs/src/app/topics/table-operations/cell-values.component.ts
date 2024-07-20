import { Component } from '@angular/core';

import { createCellCoord, createCellRange, createDataType } from 'fittable-core/model';
import { FitOperationArgs } from 'fittable-model-operations';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'cell-values',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellValuesComponent extends ConsoleTopic {
  public readonly title: TopicTitle = 'Cell values';
  public readonly buttonText = 'Add values to cells B2, C2';

  constructor() {
    super();
    this.typescriptCode.splice(2, 0, { image: 'cell-values-ts.jpg' });
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'cell-value',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(1, 2)),
      ],
      value: '2023-12-31 07:30',
      dataType: createDataType('date-time', 'yyyy-MM-dd'),
    };
    this.fit.operationExecutor?.run(args);
  }
}
