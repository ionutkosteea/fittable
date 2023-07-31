import { Component, Input } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import { Control } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-button',
  template:
    '<div class="fit-toolbar-button" [ngStyle]="getStyle()" (click)="onClick()" [title]="getLabel()">&nbsp;</div>',
})
export class ButtonComponent {
  @Input() model!: Control;

  public getStyle(): CssStyle {
    const style: CssStyle = createToggleStyle(this.model) ?? {};
    style['background-image'] = this.model.getIcon();
    return style;
  }

  public onClick(): void {
    !this.model.isDisabled() && this.model.run();
  }

  public getLabel(): string {
    return this.model.getLabel();
  }
}
