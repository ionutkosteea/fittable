import { Control, SelectorWindow } from 'fittable-core/view-model';

import { FitWindow } from './fit-window.js';

export class FitSelectorWindow<T extends string>
  extends FitWindow<T>
  implements SelectorWindow
{
  private controlId?: T;

  public setControlId(id?: T): this {
    this.controlId = id;
    return this;
  }

  public getControlId(): string | undefined {
    return this.controlId;
  }

  public getSelectedControl(): Control | undefined {
    return this.controlId ? this.getControl(this.controlId) : undefined;
  }
}
