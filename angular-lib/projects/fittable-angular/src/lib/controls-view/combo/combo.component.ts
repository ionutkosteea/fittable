import { Component, Input } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import { Control, PopupControl } from 'fittable-core/view-model';

import { PopupControlComponent } from '../common/popup-control-component.model';

@Component({
  selector: 'fit-combo',
  template: `
    <div class="fit-relative-container">
      <input
        class="fit-toolbar-combo"
        [ngStyle]="getStyle()"
        [value]="getLabel()"
        (click)="run()"
        [title]="getLabel()"
        readonly
        type="text"
      />
      <fit-context-menu
        [model]="getWindow()"
        [top]="'2rem'"
        [maxHeight]="'18.75rem'"
        [controlStyleFn]="controlStyleFn"
      ></fit-context-menu>
    </div>
  `,
})
export class ComboComponent extends PopupControlComponent {
  @Input('model') override control!: PopupControl;
  @Input() controlStyleFn?: (control: Control) => CssStyle | null;
}
