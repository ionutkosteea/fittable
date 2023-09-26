import { Injectable } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import { Control } from 'fittable-core/view-model';

import { createToggleStyle } from './style-functions.model';

@Injectable({ providedIn: 'root' })
export abstract class ControlComponent {
  public abstract control: Control;

  public getLabel(): string {
    return this.control.getLabel();
  }

  public getIcon(): string | undefined {
    return this.control.getIcon();
  }

  public run(): void {
    !this.control.isDisabled() && this.control.isValid() && this.control.run();
  }

  public getStyle(): CssStyle {
    let style: CssStyle | null = createToggleStyle(this.control);
    if (style) style['background-image'] = this.getIcon();
    else style = { 'background-image': this.getIcon() };
    return style;
  }
}
