import { Component } from '@angular/core';

import { createLineRange } from 'fittable-core/model';
import { FitOperationArgs } from 'fittable-model-operations';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'resize-columns',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ResizeColsComponent extends ConsoleTopic {
  public readonly title: TopicTitle = 'Resize columns';
  public readonly buttonText = 'Resize columns B, C';

  constructor() {
    super();
    this.typescriptCode.splice(2, 0, { image: 'resize-cols-ts.jpg' });
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'column-width',
      selectedLines: [createLineRange(1, 2)],
      width: 50,
    };
    this.fit.operationExecutor?.run(args);
  }
}
