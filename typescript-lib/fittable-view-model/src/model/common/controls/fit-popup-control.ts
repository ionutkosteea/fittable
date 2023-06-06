import { PopupControl } from 'fittable-core/view-model';

import { FitControl } from './fit-control.js';
import { FitWindow } from './fit-window.js';

export class FitPopupControl<Id extends string>
  extends FitControl
  implements PopupControl
{
  private selectedControlId?: Id;

  constructor(private window: FitWindow<Id>) {
    super();
  }

  public getWindow(): FitWindow<Id> {
    return this.window;
  }

  public setSelectedControl(id: Id): this {
    this.selectedControlId = id;
    return this;
  }

  public getSelectedControl(): Id | undefined {
    return this.selectedControlId;
  }
}
