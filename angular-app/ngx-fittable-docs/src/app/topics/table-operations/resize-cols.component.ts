import { Component } from '@angular/core';

import { createLineRange } from 'fit-core/model';
import { FitOperationDtoArgs } from 'fit-model-operations';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'resize-columns',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class ResizeColsComponent extends ConsoleTopic {
  public readonly title: TopicTitle = 'Resize columns';
  public readonly buttonText = 'Resize columns B, C';

  constructor() {
    super();
    this.typescriptCode.splice(2, 0, { image: 'resize-cols-ts.jpg' });
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
      id: 'column-width',
      selectedLines: [createLineRange(1, 2)],
      dimension: 50,
    };
    this.fit.operationExecutor?.run(args);
  }
}
