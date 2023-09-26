import { Component, Input, OnInit } from '@angular/core';

import { PopupControl, Window } from 'fittable-core/view-model';

import { WindowComponent } from '../common/window-component.model';

@Component({
  selector: 'fit-border-popup',
  templateUrl: './border-popup.component.html',
})
export class BorderPopupButtonComponent
  extends WindowComponent
  implements OnInit
{
  @Input('model') popupControl!: PopupControl;
  private isColorPickerVisible = false;
  private isBorderTypeVisible = false;

  public getWindow(): Window {
    return this.popupControl.getWindow();
  }

  public ngOnInit(): void {
    this.init();
  }

  public showColorPicker(show: boolean): void {
    this.isColorPickerVisible = show;
  }

  public showBorderType(show: boolean): void {
    this.isBorderTypeVisible = show;
  }

  public getLeftPanelIDs(): string[] {
    return this.getWindow()
      .getControlIds()
      .slice(0, this.getFirstSepartorIndex());
  }

  public getRightPanelIDs(): string[] {
    return this.getWindow()
      .getControlIds()
      .slice(this.getFirstSepartorIndex() + 1);
  }

  public getFirstSepartorIndex(): number {
    const ids: (string | number)[] = this.getControlIds();
    for (let i = 0; i < ids.length; i++) {
      if (this.getControlType('' + ids[i]) === 'separator') return i;
    }
    return 0;
  }

  public override onGlobalMouseDown(): void {
    if (this.isColorPickerVisible || this.isBorderTypeVisible) return;
    super.onGlobalMouseDown();
  }
}
