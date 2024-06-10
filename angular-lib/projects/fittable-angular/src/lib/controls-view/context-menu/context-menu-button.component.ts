import { Component, input } from '@angular/core';

import { PopupControl, Window } from 'fittable-core/view-model';

import { ButtonComponent } from '../button/button.component';
import { ContextMenuComponent } from './context-menu.component';

@Component({
  selector: 'fit-context-menu-button',
  standalone: true,
  imports: [ButtonComponent, ContextMenuComponent],
  template: `
    <fit-button [model]="model()"></fit-button>
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
  model = input.required<PopupControl>();

  getWindow(): Window {
    return this.model().getWindow();
  }
}
