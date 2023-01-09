import { OptionsControl, Window } from 'fit-core/view-model/index.js';

import { FitControl } from './fit-control.js';

export class FitOptionsControl extends FitControl implements OptionsControl {
  private selectedOptionId?: string;

  constructor(private window: Window) {
    super();
  }

  public getWindow(): Window {
    return this.window;
  }

  public setSelectedControl(id: string): this {
    this.selectedOptionId = id;
    return this;
  }

  public getSelectedControl(): string | undefined {
    return this.selectedOptionId;
  }
}
