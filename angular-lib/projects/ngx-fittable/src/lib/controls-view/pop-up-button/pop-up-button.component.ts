import { Component, Input, OnInit } from '@angular/core';

import { CssStyle } from 'fit-core/model';
import {
  OptionsControl,
  WindowListener,
  createWindowListener,
  Control,
} from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';
import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-pop-up-button',
  templateUrl: './pop-up-button.component.html',
  styleUrls: ['./pop-up-button.component.css'],
})
export class PopUpButtonComponent extends OptionsComponent implements OnInit {
  @Input() override model!: OptionsControl;

  protected override windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }

  public getButtonStyle(): CssStyle | null {
    const style: CssStyle = createToggleStyle(this.model);
    const control: Control | undefined = this.getSelectedControl();
    if (control) {
      style['background-image'] = control.getIcon();
      style['background-repeat'] = 'no-repeat';
    }
    return style;
  }
}
