import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import { Control } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';
import { SvgImageDirective } from '../../common/svg-image.directive';

@Component({
  selector: 'fit-button',
  standalone: true,
  imports: [NgStyle, SvgImageDirective],
  template: `
    <button
      fitSvgImage
      [svgContent]="getImage()"
      [ngStyle]="getStyle()"
      [title]="getLabel()"
      (click)="run()"
    ></button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input({ required: true }) model!: Control;

  getImage(): string | undefined {
    return this.model.getIcon();
  }

  getLabel(): string {
    return this.model.getLabel();
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model);
  }

  run(): void {
    !this.model.isDisabled() && this.model.isValid() && this.model.run();
  }
}
