import { Component, Input, OnInit } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  PopupControl,
  WindowListener,
  createWindowListener,
  Control,
} from 'fittable-core/view-model';

import { PopupControlComponent } from '../common/popup-control-component.model';
import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-popup-button',
  templateUrl: './popup-button.component.html',
  styleUrls: [
    '../common/css/controls-common.css',
    './popup-button.component.css',
  ],
})
export class PopupButtonComponent
  extends PopupControlComponent
  implements OnInit
{
  @Input() override model!: PopupControl;

  public override windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }

  public getButtonStyle(): CssStyle | null {
    const style: CssStyle = createToggleStyle(this.model);
    const control: Control | undefined = this.getSelectedControl();
    if (control) {
      style['background-image'] = control.getIcon();
    }
    return style;
  }
}
