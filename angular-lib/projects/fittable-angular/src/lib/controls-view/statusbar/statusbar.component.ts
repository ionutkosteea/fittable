import { Component, Input, OnDestroy } from '@angular/core';

import { Statusbar } from 'fittable-core/view-model';

@Component({
  selector: 'fit-statusbar',
  template: '<div class="statusbar">{{model.getText()}}</div>',
  styles: [
    `
      .statusbar {
        position: relative;
        padding-right: 0.875rem;
        border-top: 1px solid var(--statusbar-border-color);
        background-color: var(--statusbar-background-color);
        color: var(--statusbar-color);
        width: auto;
        text-align: right;
        font-size: 0.625rem;
        line-height: 1.2rem;
      }
    `,
  ],
})
export class StatusbarComponent implements OnDestroy {
  @Input() model!: Statusbar;

  public ngOnDestroy(): void {
    this.model.destroy();
  }
}
