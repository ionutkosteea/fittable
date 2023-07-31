import { Component, Input, OnInit } from '@angular/core';

import { Value, CssStyle } from 'fittable-core/model';
import {
  PopupControl,
  Control,
  ValueControl,
  asValueControl,
  WindowListener,
  createWindowListener,
} from 'fittable-core/view-model';

import { PopupControlComponent } from '../common/popup-control-component.model';
import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-combo',
  templateUrl: './combo.component.html',
})
export class ComboComponent extends PopupControlComponent implements OnInit {
  @Input() override model!: PopupControl;
  @Input() isFontCombo = false;

  public override windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }

  public getComboStyle(): CssStyle {
    const style: CssStyle = createToggleStyle(this.model) ?? {};
    style['background-image'] = this.getIcon();
    return style;
  }

  public getPopupStyle(id: string): CssStyle | null {
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
