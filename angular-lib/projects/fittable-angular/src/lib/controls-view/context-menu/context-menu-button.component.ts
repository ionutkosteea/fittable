import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PopupControl } from 'fittable-core/view-model';

import { PopupControlComponent } from '../common/popup-control-component.model';

@Component({
  selector: 'fit-context-menu-button',
  template: `
    <div class="fit-relative-container">
      <fit-button [model]="control"></fit-button>
      <fit-context-menu [model]="getWindow()" [top]="'2rem'"></fit-context-menu>
    </div>
  `,
})
export class ContextMenuButtonComponent extends PopupControlComponent {
  @Input('model') control!: PopupControl;
  @ViewChild('button') buttonRef?: ElementRef;
}
