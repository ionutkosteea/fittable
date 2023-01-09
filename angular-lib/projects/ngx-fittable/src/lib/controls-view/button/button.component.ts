import { Component, Input } from '@angular/core';

import { CssStyle } from 'fit-core/model';
import { Control } from 'fit-core/view-model';

@Component({
  selector: 'fit-button',
  template:
    '<div [ngStyle]="getStyle()" (mousedown)="onMouseDown()">&nbsp;</div>',
})
export class ButtonComponent {
  @Input() model!: Control;

  public getStyle(): CssStyle {
    return {
      backgroundImage: this.model.getIcon(),
      backgroundRepeat: 'no-repeat',
    };
  }

  public onMouseDown(): void {
    this.model.run();
  }
}
