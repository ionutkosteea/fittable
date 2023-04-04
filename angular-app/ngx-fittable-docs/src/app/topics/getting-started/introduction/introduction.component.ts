import { Component } from '@angular/core';

import { TopicTitle } from '../../../common/topic-title.model';

@Component({
  selector: 'introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['../../common/common.css', './introduction.component.css'],
})
export class IntroductionComponent {
  public readonly title: TopicTitle = 'Introduction';
}
