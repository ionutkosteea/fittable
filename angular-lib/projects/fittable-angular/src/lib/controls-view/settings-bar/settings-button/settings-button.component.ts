import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PopupControl, Window } from 'fittable-core/view-model';

@Component({
  selector: 'fit-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
})
export class SettingsButtonComponent {
  @Input({ required: true }) model!: PopupControl;
  @ViewChild('button') buttonRef?: ElementRef;

  getIcon(): string | undefined {
    return this.model.getIcon();
  }

  getLabel(): string {
    return this.model.getLabel();
  }

  run(): void {
    this.model.run();
  }

  getWindow(): Window {
    return this.model.getWindow();
  }
}
