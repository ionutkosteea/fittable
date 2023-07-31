import { Component, Input, OnDestroy } from '@angular/core';

import { Statusbar } from 'fittable-core/view-model';

@Component({
  selector: 'fit-statusbar',
  template: '<div class="fit-statusbar">{{model.getText()}}</div>',
})
export class StatusbarComponent implements OnDestroy {
  @Input() model!: Statusbar;

  public ngOnDestroy(): void {
    this.model.destroy();
  }
}
