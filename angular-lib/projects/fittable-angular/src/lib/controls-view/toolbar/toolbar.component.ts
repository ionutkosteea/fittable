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
})
export class ToolbarComponent {
  @Input() model!: Container;

  public readonly getControlIDs = (): string[] => this.model.getControlIds();

  public readonly getControlType = (id: string): ControlType =>
    this.getControl(id).getType() as ControlType;

  public readonly getControl = (id: string): Control =>
    this.model.getControl(id);

  public getInputControl(id: string): InputControl {
    const input: InputControl | undefined = asInputControl(this.getControl(id));
    if (input) return input;
    else throw new Error('Invalid input control for id ' + id);
  }

  public getPopupControl(id: string): PopupControl {
    const control: Control = this.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error('Invalid popup control for id ' + id);
  }

  public getComboControlStyle(control: Control): CssStyle | null {
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid valud control');
    const value: Value | undefined = valueControl.getValue();
    if (value) return { fontFamily: value as CssValue };
    else return null;
  }
}
