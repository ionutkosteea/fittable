import { Component, Input } from '@angular/core';

import { Statusbar } from 'fittable-core/view-model';

@Component({
  selector: 'custom-statusbar',
  template: '<div class="statusbar">{{model.getText()}}<div>',
  styles: [
    `
      .statusbar {
        border: 1px solid;
        padding: 4px;
      }
    `,
  ],
})
export class CustomStatusbarComponent {
  @Input() model!: Statusbar;
}
