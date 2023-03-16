import { Component, Input, OnInit } from '@angular/core';

import { CssStyle } from 'fit-core/model';
import {
  Control,
  OptionsControl,
  WindowListener,
  createWindowListener,
} from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';
import { ControlType } from '../common/control-type.model';
import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-border-pop-up',
  templateUrl: './border-pop-up.component.html',
  styleUrls: ['./border-pop-up.component.css'],
})
export class BorderPopUpButtonComponent
  extends OptionsComponent
  implements OnInit
{
  @Input() override model!: OptionsControl;
  protected override windowListener!: WindowListener;

  private isColorPickerVisible = false;
  private isBorderTypeVisible = false;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }

  public getButtonStyle(): CssStyle {
    const style: CssStyle = createToggleStyle(this.model);
    style['background-image'] = this.getButtonIcon();
    style['background-repeat'] = 'no-repeat';
    return style;
  }

  private getButtonIcon(): string | undefined {
    const controls: Control[] = this.model.getWindow().getControls();
    if (controls.length === 0) return undefined;
    else return controls[controls.length - 1].getIcon();
  }

  public showColorPicker(show: boolean): void {
    this.isColorPickerVisible = show;
  }

  public showBorderType(show: boolean): void {
    this.isBorderTypeVisible = show;
  }

  public getControlType(id: string): ControlType {
    return this.model.getWindow().getControl(id).getType() as ControlType;
  }

  public getLeftPanelIDs(): string[] {
    return this.model
      .getWindow()
      .getControlIds()
      .slice(0, this.getFirstSepartorIndex());
  }

  public getRightPanelIDs(): string[] {
    return this.model
      .getWindow()
      .getControlIds()
      .slice(this.getFirstSepartorIndex() + 1);
  }

  public getFirstSepartorIndex(): number {
    const ids: (string | number)[] = this.model.getWindow().getControlIds();
    for (let i = 0; i < ids.length; i++) {
      if (this.getControlType('' + ids[i]) === 'separator') return i;
    }
    return 0;
  }

  public override onGlobalMouseDown(): void {
    if (this.isColorPickerVisible || this.isBorderTypeVisible) return;
    this.windowListener.onGlobalMouseDown();
  }
}
