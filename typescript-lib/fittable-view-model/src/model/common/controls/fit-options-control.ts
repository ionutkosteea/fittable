import { OptionsControl } from 'fittable-core/view-model';

import { FitControl } from './fit-control.js';
import { FitWindow } from './fit-window.js';

export class FitOptionsControl<Id extends string>
  extends FitControl
  implements OptionsControl
{
  private selectedOptionId?: Id;

  constructor(private window: FitWindow<Id>) {
    super();
  }

  public getWindow(): FitWindow<Id> {
    return this.window;
  }

  public setSelectedControl(id: Id): this {
    this.selectedOptionId = id;
    return this;
  }

  public getSelectedControl(): Id | undefined {
    return this.selectedOptionId;
  }
}
