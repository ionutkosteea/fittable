import { Component, Input } from '@angular/core';

import { PopupControl, Window } from 'fittable-core/view-model';

@Component({
  selector: 'fit-context-menu-button',
  template: `
    <fit-button [model]="model"></fit-button>
    <fit-context-menu [model]="getWindow()" [top]="'2rem'"></fit-context-menu>
  `,
  styles: [
    `
      :host {
        position: relative;
      }
    `,
  ],
})
export class ContextMenuButtonComponent {
  @Input({ required: true }) model!: PopupControl;

  getWindow(): Window {
    return this.model.getWindow();
  }
}
