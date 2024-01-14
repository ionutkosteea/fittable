import { Component, Input } from '@angular/core';

import {
  Container,
  Control,
  PopupControl,
  asPopupControl,
} from 'fittable-core/view-model';

@Component({
  selector: 'fit-settingsbar',
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
  @Input() model!: Container;

  getControlIds(): string[] {
    return this.model.getControlIds();
  }

  getPopupControl(id: string): PopupControl {
    const control: Control = this.model.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error(`Invalid popup control for id '${id}'`);
  }
}
