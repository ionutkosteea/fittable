import { Component, Input } from '@angular/core';

import { Control } from 'fittable-core/view-model';

import { ControlComponent } from '../common/control-component.model';

@Component({
  selector: 'fit-button',
  template:
    '<div class="fit-toolbar-button" [ngStyle]="getStyle()" (click)="run()" [title]="getLabel()">&nbsp;</div>',
})
export class ButtonComponent extends ControlComponent {
  @Input('model') control!: Control;
}
