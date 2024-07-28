import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  PopupControl,
  Window,
  Control,
  asPopupControl,
} from 'fittable-core/view-model';

import { ControlType } from '../common/control-type.model';
import { ButtonComponent } from '../button/button.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

import { BorderTypeComponent } from './border-type/border-type.component';

@Component({
  selector: 'fit-border-popup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    PopupMenuComponent,
    BorderTypeComponent,
    ColorPickerComponent,
  ],
  templateUrl: './border-popup.component.html',
  styleUrls: ['../common/scss/utils.scss', './border-popup.component.scss'],
})
export class BorderPopupComponent {
  model = input.required<PopupControl>();

  protected isColorPickerVisible = signal(false);
  protected isBorderTypeVisible = signal(false);

  get window(): Window {
    return this.model().getWindow();
  }

  getLeftPanelIDs(): string[] {
    return this.window
      .getControlIds()
      .slice(0, this.getFirstSepartorIndex());
  }

  getRightPanelIDs(): string[] {
    return this.window
      .getControlIds()
      .slice(this.getFirstSepartorIndex() + 1);
  }

  getControl(id: string): Control {
    return this.window.getControl(id);
  }

  getPopupControl(id: string): PopupControl {
    const popupControl: PopupControl | undefined = asPopupControl(this.getControl(id));
    if (popupControl) return popupControl;
    else throw Error(`Invalid popup control for id: ${id}`);
  }

  getControlType(id: string): ControlType {
    return this.getControl(id).getType() as ControlType;
  }

  getFirstSepartorIndex(): number {
    const ids: (string | number)[] = this.window.getControlIds();
    for (let i = 0; i < ids.length; i++) {
      if (this.getControlType('' + ids[i]) === 'separator') return i;
    }
    return 0;
  }
}
