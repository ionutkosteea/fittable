import { Component, Input } from '@angular/core';

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

@Component({
  selector: 'fit-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Input() model!: Container;

  getControlIDs(): string[] {
    return this.model.getControlIds();
  }

  getControlType(id: string): ControlType {
    return this.getControl(id).getType() as ControlType;
  }

  getControl(id: string): Control {
    return this.model.getControl(id);
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
