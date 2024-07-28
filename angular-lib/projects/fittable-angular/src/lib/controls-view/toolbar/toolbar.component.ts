import { Component, input } from '@angular/core';
import {
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';

import { CssStyle, CssValue, Value } from 'fittable-core/model';
import {
  Container,
  Control,
  InputControl,
  asInputControl,
  PopupControl,
  asPopupControl,
  ValueControl,
  asValueControl,
} from 'fittable-core/view-model';

import { ControlType } from '../common/control-type.model';
import { ButtonComponent } from '../button/button.component';
import { ComboComponent } from '../combo/combo.component';
import { InputComponent } from '../input/input.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { PopupButtonComponent } from '../popup-button/popup-button.component';
import { BorderPopupComponent } from '../border-popup/border-popup.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuButtonComponent } from '../context-menu/context-menu-button.component';

@Component({
  selector: 'fit-toolbar',
  standalone: true,
  imports: [
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    ButtonComponent,
    ComboComponent,
    InputComponent,
    ColorPickerComponent,
    PopupButtonComponent,
    BorderPopupComponent,
    ContextMenuComponent,
    ContextMenuButtonComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  model = input.required<Container>();

  get controlIds(): string[] {
    return this.model().getControlIds();
  }

  getControlType(id: string): ControlType {
    return this.getControl(id).getType() as ControlType;
  }

  getControl(id: string): Control {
    return this.model().getControl(id);
  }

  getInputControl(id: string): InputControl {
    const input: InputControl | undefined = asInputControl(this.getControl(id));
    if (input) return input;
    else throw new Error('Invalid input control for id ' + id);
  }

  getPopupControl(id: string): PopupControl {
    const control: Control = this.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error('Invalid popup control for id ' + id);
  }

  getComboControlStyle(control: Control): CssStyle | null {
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid valud control');
    const value: Value | undefined = valueControl.getValue();
    if (value) return { fontFamily: value as CssValue };
    else return null;
  }
}
