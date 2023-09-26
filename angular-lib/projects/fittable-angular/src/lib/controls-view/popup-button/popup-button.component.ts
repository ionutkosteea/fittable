import { Component, Input, OnInit } from '@angular/core';

import { PopupControl, Window } from 'fittable-core/view-model';

import { WindowComponent } from '../common/window-component.model';

@Component({
  selector: 'fit-popup-button',
  template: `
    <div class="fit-relative-container">
      <fit-button [model]="popupControl"></fit-button>
      <div
        class="fit-button-menu"
        [ngStyle]="getWindowStyle()"
        (mousedown)="onMouseDown($event)"
        (window:mousedown)="onGlobalMouseDown()"
      >
        <div class="fit-toolbar-button-bar">
          <div
            class="fit-toolbar-button"
            *ngFor="let id of getControlIds()"
            [ngStyle]="{ backgroundImage: getControlIcon(id) }"
            (click)="runControl(id)"
            [title]="getControlLabel(id)"
          >
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PopupButtonComponent extends WindowComponent implements OnInit {
  @Input('model') popupControl!: PopupControl;

  public override getWindow(): Window {
    return this.popupControl.getWindow();
  }

  public ngOnInit(): void {
    this.init();
  }
}
