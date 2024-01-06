import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PopupControl } from 'fittable-core/view-model';

import { PopupControlComponent } from '../../common/popup-control-component.model';

@Component({
  selector: 'fit-settings-button',
  template: `
    <div class="fit-relative-container">
      <div
        class="fit-settingsbar-button"
        #button
        [ngStyle]="{ backgroundImage: getIcon() }"
        (click)="run()"
        [title]="getLabel()"
      >
        &nbsp;
      </div>
      <fit-context-menu
        [model]="getWindow()"
        [left]="'auto'"
        [top]="'1.25rem'"
        [right]="0"
        [iconCol]="'right'"
      />
    </div>
  `,
})
export class SettingsButtonComponent extends PopupControlComponent {
  @Input('model') override control!: PopupControl;
  @ViewChild('button') buttonRef?: ElementRef;
}
