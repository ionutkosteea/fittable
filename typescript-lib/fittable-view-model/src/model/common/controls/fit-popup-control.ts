import { PopupControl } from 'fittable-core/view-model';

import { FitControl } from './fit-control.js';
import { FitWindow } from './fit-window.js';

export class FitPopupControl<Id extends string>
  extends FitControl
  implements PopupControl
{
  constructor(private window: FitWindow<Id>) {
    super();
  }

  public getWindow(): FitWindow<Id> {
    return this.window;
  }
}
