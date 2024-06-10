import { Component, input } from '@angular/core';
import { NgFor } from '@angular/common';

import {
  Container,
  Control,
  PopupControl,
  asPopupControl,
} from 'fittable-core/view-model';

import { SettingsButtonComponent } from './settings-button/settings-button.component';

@Component({
  selector: 'fit-settingsbar',
  standalone: true,
  imports: [NgFor, SettingsButtonComponent],
  template: `
    <div class="settings-bar">
      <fit-settings-button
        *ngFor="let id of getControlIds()"
        [model]="getPopupControl(id)"
      />
    </div>
  `,
  styleUrls: ['./settings-bar.component.scss'],
})
export class SettingsBarComponent {
  model = input.required<Container>();

  getControlIds(): string[] {
    return this.model().getControlIds();
  }

  getPopupControl(id: string): PopupControl {
    const control: Control = this.model().getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error(`Invalid popup control for id '${id}'`);
  }
}
