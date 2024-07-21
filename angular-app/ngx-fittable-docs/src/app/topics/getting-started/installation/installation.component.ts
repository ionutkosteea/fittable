import { Component } from '@angular/core';

import { TopicTitle } from '../../../common/topic-title.model';

@Component({
  selector: 'installation',
  templateUrl: './installation.component.html',
  styleUrls: ['../../common/common.css'],
})
export class InstallationComponent {
  public readonly title: TopicTitle = 'Installation';
}
