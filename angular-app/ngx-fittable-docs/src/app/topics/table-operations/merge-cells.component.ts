import { Component } from '@angular/core';

import { createCellCoord, createCellRange } from 'fittable-core/model';
import { FitOperationArgs } from 'fittable-model-operations';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'merge-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class MergeCellsComponent extends ConsoleTopic {
  public readonly title: TopicTitle = 'Merge cells';
  public readonly buttonText = 'Merge cells B2:C3';

  constructor() {
    super();
    this.typescriptCode.splice(2, 0, { image: 'merge-cells-ts.jpg' });
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'cell-merge',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(2, 2)),
      ],
    };
    this.fit.operationExecutor?.run(args);
  }
}
