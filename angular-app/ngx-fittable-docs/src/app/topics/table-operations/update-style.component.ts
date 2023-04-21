import { Component } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createStyle,
} from 'fittable-core/model';
import { FitStyle } from 'fittable-model';
import { FitOperationArgs } from 'fittable-model-operations';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'update-style',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class UpdateStyleComponent extends ConsoleTopic {
  public readonly title: TopicTitle = 'Update style';
  public readonly buttonText = 'Update style for B2:D4';

  constructor() {
    super();
    this.typescriptCode.splice(2, 0, { image: 'update-style-ts.jpg' });
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'style-update',
      selectedCells: [
        createCellRange(createCellCoord(1, 1), createCellCoord(3, 3)),
      ],
      styleSnippet: createStyle<FitStyle>().set('background-color', 'red'),
    };
    this.fit.operationExecutor?.run(args);
  }
}
