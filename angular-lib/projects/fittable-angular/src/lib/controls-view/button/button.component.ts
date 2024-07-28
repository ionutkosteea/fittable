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
      [title]="label"
      (click)="run()"
    >
       <fit-svg-img [content]="icon"/>
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  model = input.required<Control>();

  get label(): string {
    return this.model().getLabel();
  }

  get icon(): string | undefined {
    return this.model().getIcon();
  }

  isOn(): boolean {
    return asToggleControl(this.model())?.isOn() ?? false;
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model());
  }

  run(): void {
    !this.model().isDisabled() && this.model().isValid() && this.model().run();
  }
}
