import { Subject } from 'rxjs';

import { InputControl } from 'fit-core/view-model/index.js';

import { FitValueControl } from './fit-value-control.js';

export class FitInputControl extends FitValueControl implements InputControl {
  public readonly focus$: Subject<boolean> = new Subject();
  public readonly scrollToEnd$: Subject<void> = new Subject();
  public readonly ctrlEnter$: Subject<void> = new Subject();

  private textCursor = false;

  public hasTextCursor(): boolean {
    return this.textCursor;
  }

  public setTextCursor(visible: boolean): this {
    this.textCursor = visible;
    return this;
  }
}
