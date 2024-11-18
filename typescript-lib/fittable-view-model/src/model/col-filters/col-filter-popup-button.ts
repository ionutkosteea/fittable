import { ToggleControl } from 'fittable-core/view-model';

import { FitPopupControl } from '../common/controls/fit-popup-control.js';

export class ColFilterPopupButton<ControlId extends string>
  extends FitPopupControl<ControlId>
  implements ToggleControl {
  private on?: boolean;
  private onFn?: () => boolean;

  public isOn(): boolean {
    return this.on ?? (this.onFn && this.onFn()) ?? false;
  }

  public setOn(on: boolean): this {
    this.on = on;
    return this;
  }

  public setOnFn(onFn: () => boolean): this {
    this.onFn = onFn;
    return this;
  }
}
