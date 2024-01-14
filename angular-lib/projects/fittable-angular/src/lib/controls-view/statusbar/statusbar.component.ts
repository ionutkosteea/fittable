import { Component, Input, OnDestroy } from '@angular/core';

import { Statusbar } from 'fittable-core/view-model';

@Component({
  selector: 'fit-statusbar',
  template: '<div class="statusbar">{{model.getText()}}</div>',
  styleUrl: './statusbar.component.scss',
})
export class StatusbarComponent implements OnDestroy {
  @Input() model!: Statusbar;

  ngOnDestroy(): void {
    this.model.destroy();
  }
}
