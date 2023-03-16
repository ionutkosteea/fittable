import { Component, Input, OnInit } from '@angular/core';

import { Value, CssStyle } from 'fit-core/model';
import {
  OptionsControl,
  Control,
  ValueControl,
  asValueControl,
  WindowListener,
  createWindowListener,
} from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';
import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css'],
})
export class ComboComponent extends OptionsComponent implements OnInit {
  @Input() override model!: OptionsControl;
  @Input() isFontCombo = false;

  protected override windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }

  public getComboStyle(): CssStyle {
    return createToggleStyle(this.model);
  }

  public getComboArrowStyle(): CssStyle {
    const style: CssStyle = createToggleStyle(this.model);
    style['background-image'] = this.getIcon();
    return style;
  }

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
