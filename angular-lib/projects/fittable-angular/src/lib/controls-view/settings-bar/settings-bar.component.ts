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
    <div class="fit-settingsbar">
      <fit-settings-button
        *ngFor="let id of getControlIds()"
        [model]="getPopupControl(id)"
      />
    </div>
  `,
})
export class SettingsBarComponent {
  @Input() model!: Container;

  public readonly getControlIds = (): string[] => this.model.getControlIds();

  public getPopupControl(id: string): PopupControl {
    const control: Control = this.model.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error('Invalid popup control for id ' + id);
  }
}
