import { Component } from '@angular/core';

import { TopicTitle } from '../../../common/topic-title.model';

@Component({
  selector: 'architecture',
  template:
    '<div class="topic"><h1 class="title">{{title}}</h1><div style="margin-bottom: 1rem;"><img class="figure" src="../../../assets/code-snippets/architecture.jpg" /></div></div>',
  styleUrls: ['../../common/common.css'],
})
export class ArchitectureComponent {
  public readonly title: TopicTitle = 'Architecture';
}
