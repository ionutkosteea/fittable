import { Component, Input } from '@angular/core';

import { Statusbar } from 'fit-core/view-model';

@Component({
  selector: 'fit-statusbar',
  template: '<div class="statusbar">{{model.getText()}}</div>',
  styleUrls: ['./statusbar.component.css'],
})
export class StatusbarComponent {
  @Input() model!: Statusbar;
}
