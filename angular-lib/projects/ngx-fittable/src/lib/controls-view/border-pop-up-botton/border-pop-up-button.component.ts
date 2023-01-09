import { Component, Input } from '@angular/core';

import { Control, OptionsControl, WindowListener } from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';
import { ControlType } from '../common/control-utils.model';

@Component({
  selector: 'fit-border-pop-up-button',
  templateUrl: './border-pop-up-button.component.html',
  styleUrls: ['./border-pop-up-button.component.css'],
})
export class BorderPopUpButtonComponent extends OptionsComponent {
  @Input() override model!: OptionsControl;
  @Input() override windowListener!: WindowListener;
  private isColorPickerVisible = false;
  private isBorderTypeVisible = false;

  public getButtonIcon(): string | undefined {
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
    this.windowListener.setWindow(this.model.getWindow()).onGlobalMouseDown();
  }
}
