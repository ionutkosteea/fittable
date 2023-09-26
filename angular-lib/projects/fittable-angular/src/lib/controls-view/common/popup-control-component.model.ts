import { Injectable } from '@angular/core';

import { PopupControl, Window } from 'fittable-core/view-model';

import { ControlComponent } from './control-component.model';

@Injectable({ providedIn: 'root' })
export abstract class PopupControlComponent extends ControlComponent {
  public abstract override control: PopupControl;

  public getWindow(): Window {
    return this.control.getWindow();
  }
}
