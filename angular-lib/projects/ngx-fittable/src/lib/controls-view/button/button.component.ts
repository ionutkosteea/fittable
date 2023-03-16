import { Component, Input } from '@angular/core';

import { CssStyle } from 'fit-core/model';
import { Control } from 'fit-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-button',
  template: '<div [ngStyle]="getStyle()" (click)="onClick()">&nbsp;</div>',
})
export class ButtonComponent {
  @Input() model!: Control;

  public getStyle(): CssStyle {
    const style: CssStyle = createToggleStyle(this.model);
    style['background-image'] = this.model.getIcon();
    style['background-repeat'] = 'no-repeat';
    return style;
  }

  public onClick(): void {
    !this.model.isDisabled() && this.model.run();
  }
}
