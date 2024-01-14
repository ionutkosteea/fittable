import { Component, Input } from '@angular/core';

import { Control, PopupControl, Window } from 'fittable-core/view-model';

@Component({
  selector: 'fit-popup-button',
  templateUrl: './popup-button.component.html',
  styleUrls: ['./popup-button.component.scss'],
})
export class PopupButtonComponent {
  @Input({ required: true }) model!: PopupControl;

  getWindow(): Window {
    return this.model.getWindow();
  }

  getControlIds(): string[] {
    return this.getWindow().getControlIds();
  }

  getControl(id: string): Control {
    return this.getWindow().getControl(id);
  }
}
