import { Component } from '@angular/core';

import { createLineRange } from 'fittable-core/model';
import { FitOperationArgs } from 'fittable-model-operations';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'resize-rows',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class ResizeRowsComponent extends ConsoleTopic {
  public readonly title: TopicTitle = 'Resize rows';
  public readonly buttonText = 'Resize rows 2, 3';

  constructor() {
    super();
    this.typescriptCode.splice(2, 0, { image: 'resize-rows-ts.jpg' });
  }

  public runOperation(): void {
    const args: FitOperationArgs = {
      id: 'row-height',
      selectedLines: [createLineRange(1, 2)],
      dimension: 60,
    };
    this.fit.operationExecutor?.run(args);
  }
}
