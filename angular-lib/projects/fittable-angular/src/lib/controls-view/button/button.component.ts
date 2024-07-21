import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import { Control, asToggleControl } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';
import { SvgImgComponent } from '../svg-img/svg-img.component';

@Component({
  selector: 'fit-button',
  standalone: true,
  imports: [CommonModule, SvgImgComponent],
  template: `
    <button
      [ngStyle]="getStyle()"
      [ngClass]="{ 'is-on': isOn() }"
      [title]="getLabel()"
      (click)="run()"
    >
       <fit-svg-img [content]="getIcon()"/>
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  model = input.required<Control>();

  getLabel(): string {
    return this.model().getLabel();
  }

  getIcon(): string | undefined {
    return this.model().getIcon();
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model());
  }

  isOn(): boolean {
    return asToggleControl(this.model())?.isOn() ?? false;
  }

  run(): void {
    !this.model().isDisabled() && this.model().isValid() && this.model().run();
  }
}
