import { Component, Input } from '@angular/core';

import { Value, CssStyle } from 'fit-core/model';
import {
  OptionsControl,
  Control,
  ValueControl,
  asValueControl,
  WindowListener,
} from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';

@Component({
  selector: 'fit-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css'],
})
export class ComboComponent extends OptionsComponent {
  @Input() override model!: OptionsControl;
  @Input() override windowListener!: WindowListener;
  @Input() isFontCombo = false;

  public getOptionStyle(id: string): CssStyle | null {
    if (this.isFontCombo) {
      const control: Control = this.model.getWindow().getControl(id);
      const valueControl: ValueControl | undefined = asValueControl(control);
      if (!valueControl) throw new Error('Invalid valud control for id ' + id);
      const value: Value | undefined = valueControl.getValue();
      if (value) return { fontFamily: value };
      else return null;
    } else return null;
  }
}
