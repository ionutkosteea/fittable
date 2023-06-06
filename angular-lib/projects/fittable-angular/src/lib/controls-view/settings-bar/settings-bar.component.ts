import { Component, Input } from '@angular/core';

import {
  Container,
  Control,
  PopupControl,
  asPopupControl,
} from 'fittable-core/view-model';

@Component({
  selector: 'fit-settings-bar',
  templateUrl: './settings-bar.component.html',
  styleUrls: ['./settings-bar.component.css'],
})
export class SettingsBarComponent {
  @Input() model!: Container;

  public readonly getControlIds = (): string[] => this.model.getControlIds();

  public readonly getControl = (id: string): Control =>
    this.model.getControl(id);

  public getPopupControl(id: string): PopupControl {
    const control: Control = this.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error('Invalid popup control for id ' + id);
  }
}
