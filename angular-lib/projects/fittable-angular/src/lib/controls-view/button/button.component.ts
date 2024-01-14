import { Component, Input } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import { Control } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-button',
  template: `
    <button
      [ngStyle]="getStyle()"
      [title]="getLabel()"
      (click)="run()"
    ></button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input({ required: true }) model!: Control;

  getStyle(): CssStyle {
    let style: CssStyle | null = createToggleStyle(this.model);
    if (style) style['background-image'] = this.model.getIcon();
    else style = { 'background-image': this.model.getIcon() };
    return style;
  }

  getLabel(): string {
    return this.model.getLabel();
  }

  run(): void {
    !this.model.isDisabled() && this.model.isValid() && this.model.run();
  }
}
